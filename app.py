import os
import cv2
import glob
import shutil
import gradio as gr
from ultralytics import YOLO

# === Load your trained model ===
model = YOLO("yolov8_low_visibility_trained.pt")  # Path to your trained model

# === Detection function ===
def detect_and_return_video(video_file):
    if not video_file:
        return None  # Gradio will handle display if None

    # Run YOLOv8 prediction and save video output
    model.predict(
        source=video_file,
        save=True,
        save_conf=True,
        conf=0.25,
        iou=0.5
    )

    # Find latest prediction folder
    run_dirs = sorted(glob.glob("runs/detect/predict*"), key=os.path.getmtime)
    latest_run = run_dirs[-1]
    output_videos = glob.glob(os.path.join(latest_run, "*.mp4"))

    if not output_videos:
        return None

    # Ensure output video is renamed to a static file for Gradio
    final_path = "output.mp4"
    shutil.copy(output_videos[0], final_path)
    print(f"✅ Saved processed video to: {final_path}")

    return final_path  # Must return a string path to .mp4 file

# === Gradio Interface ===
with gr.Blocks() as demo:
    gr.Markdown("## 🚦 YOLOv8 Traffic Sign Detection & Classification")
    gr.Markdown("Upload a video below and detect/classify traffic signs.")

    with gr.Row():
        input_video = gr.Video(label="Upload Input Video", format="mp4")
        output_video = gr.Video(label="Output: Detected Video", format="mp4")

    run_btn = gr.Button("Run Detection")
    run_btn.click(fn=detect_and_return_video, inputs=input_video, outputs=output_video)

    gr.Markdown("---\nBuilt with ❤️ using Gradio and YOLOv8")

demo.launch()
