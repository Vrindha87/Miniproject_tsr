import os
import cv2
import glob
import shutil
import numpy as np
from ultralytics import YOLO
import gradio as gr
from tqdm import tqdm  # ✅ For progress bar

# Load your trained model
model = YOLO("yolov8_low_visibility_trained.pt")

# --- Batch Detection (Processes full video, returns processed file) ---
def detect_traffic_signs(video_file):
    if not video_file:
        return "No input video"

    video_path = video_file

    # Run detection with Ultralytics saving output video
    model.predict(
        source=video_path,
        save=True,
        save_conf=True,
        conf=0.25,
        iou=0.5
    )

    run_dirs = sorted(glob.glob("runs/detect/predict*"), key=os.path.getmtime)
    latest_run = run_dirs[-1]

    output_files = glob.glob(os.path.join(latest_run, "*.mp4"))
    if not output_files:
        return "No video result found"

    final_output_path = "output.mp4"
    shutil.copy(output_files[0], final_output_path)
    print(f"✅ Video saved as: {final_output_path}")

    return final_output_path


# --- Streaming Detection (Frame-by-frame for UI streaming) ---
def stream_video_detection(video_file):
    video_path = video_file
    cap = cv2.VideoCapture(video_path)

    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"📹 Streaming {frame_count} frames...")

    for _ in tqdm(range(frame_count)):
        ret, frame = cap.read()
        if not ret:
            break

        results = model.predict(frame, conf=0.25, iou=0.5)
        boxes = results[0].boxes.xyxy.cpu().numpy()
        class_ids = results[0].boxes.cls.cpu().numpy().astype(int)

        for i, box in enumerate(boxes):
            x1, y1, x2, y2 = map(int, box[:4])
            label = model.names[class_ids[i]]  # ✅ Get class name
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

        yield cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    cap.release()
    print("✅ Streaming complete.")


# --- Gradio UI ---
with gr.Blocks() as demo:
    gr.Markdown("## 🛑 Traffic Sign Detection App")
    gr.Markdown("Upload a video to detect traffic signs using a YOLOv8 model.")

    with gr.Tab("1️⃣ Batch Detection (Returns Processed Video)"):
        input_video = gr.Video(label="Upload Video")
        output_video = gr.Video(label="Detected Video")
        run_btn = gr.Button("Detect Traffic Signs")
        run_btn.click(fn=detect_traffic_signs, inputs=input_video, outputs=output_video)

    with gr.Tab("2️⃣ Live-style Detection (Frame by Frame)"):
        input_stream = gr.Video(label="Upload Video for Streaming")
        stream_output = gr.Image(label="Live Frame Output")
        stream_btn = gr.Button("Start Streaming")
        stream_btn.click(fn=stream_video_detection, inputs=input_stream, outputs=stream_output)

    gr.Markdown("---\nBuilt with ❤️ using YOLOv8, Gradio, and OpenCV")

demo.launch()
