import os
import cv2
import glob
import shutil
import numpy as np
from ultralytics import YOLO
import gradio as gr

# Load your trained model
model = YOLO("yolov8_low_visibility_trained.pt")  # ✅ Change if your model is in a different path

# --- Batch Detection (Full video, returns processed video file) ---
def detect_traffic_signs(video_file):
    if not video_file:
        return "No input video"

    video_path = video_file  # ✅ FIXED: video_file is already a path string

    model.predict(
        source=video_path,
        save=True,
        save_conf=True,
        conf=0.25,
        iou=0.5
    )

    # Locate the latest prediction folder
    run_dirs = sorted(glob.glob("runs/detect/predict*"), key=os.path.getmtime)
    latest_run = run_dirs[-1]

    # Find the output .mp4 file
    output_files = glob.glob(os.path.join(latest_run, "*.mp4"))
    if not output_files:
        return "No video result found"

    final_output_path = "output.mp4"
    shutil.copy(output_files[0], final_output_path)

    return final_output_path

# --- Real-Time-style Detection (Streams annotated frames) ---
def stream_video_detection(video_file):
    video_path = video_file  # ✅ FIXED

    cap = cv2.VideoCapture(video_path)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = model.predict(frame, conf=0.25, iou=0.5)
        boxes = results[0].boxes.xyxy.cpu().numpy()

        for box in boxes:
            x1, y1, x2, y2 = map(int, box[:4])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        # Yield RGB frame to Gradio
        yield cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    cap.release()

# --- Gradio UI ---
with gr.Blocks() as demo:
    gr.Markdown("## 🛑 Traffic Sign Detection App")
    gr.Markdown("Upload a video to detect traffic signs using a YOLOv8 model.")

    with gr.Tab("1️⃣ Batch Detection (Returns Processed Video)"):
        input_video = gr.Video(label="Upload Video")  # No `type="filepath"` needed
        output_video = gr.Video(label="Detected Video")
        run_btn = gr.Button("Run Detection")
        run_btn.click(fn=detect_traffic_signs, inputs=input_video, outputs=output_video)

    with gr.Tab("2️⃣ Live-style Detection (Frame by Frame)"):
        input_stream = gr.Video(label="Upload Video for Streaming")
        stream_output = gr.Image(label="Live Frame Output")
        stream_btn = gr.Button("Start Streaming")
        stream_btn.click(fn=stream_video_detection, inputs=input_stream, outputs=stream_output)

demo.launch()
