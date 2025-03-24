import gradio as gr
import os
import glob
from ultralytics import YOLO

# Load trained YOLOv8 model
model = YOLO("yolov8_low_visibility_trained.pt")

def detect_traffic_signs(video_path):
    if not video_path:
        return "No video input provided."

    # Run YOLO prediction
    model.predict(
        source=video_path,
        save=True,
        save_conf=True,
        conf=0.25,
        iou=0.5
    )

    # Find most recent run directory
    latest_dir = sorted(glob.glob("runs/detect/predict*"), key=os.path.getmtime)[-1]
    output_videos = glob.glob(os.path.join(latest_dir, "*.mp4"))

    if not output_videos:
        return "Error: No output video generated."

    return output_videos[0]

# Gradio interface
demo = gr.Interface(
    fn=detect_traffic_signs,
    inputs=gr.Video(label="Upload Traffic Video"),
    outputs=gr.Video(label="Detected Traffic Signs"),
    title="Traffic Sign Detection",
    description="Upload a traffic video. The model will detect and return the annotated video."
)

# 👇 IMPORTANT: Hugging Face Spaces requires this
demo.launch()
