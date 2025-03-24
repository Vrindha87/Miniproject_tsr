

import os
import glob
import shutil
from ultralytics import YOLO

model = YOLO("yolov8_low_visibility_trained.pt")  # Make sure this is your trained model path

def detect_traffic_signs(video_path):
    if not video_path:
        return "No input video"

    # Run detection
    model.predict(
        source=video_path,
        save=True,
        save_conf=True,
        conf=0.25,
        iou=0.5
    )

    # Locate latest prediction folder
    run_dirs = sorted(glob.glob("runs/detect/predict*"), key=os.path.getmtime)
    latest_run = run_dirs[-1]

    # Find output video file inside the prediction folder
    output_files = glob.glob(os.path.join(latest_run, "*.mp4"))
    if not output_files:
        return "No video result found"

    # Copy to a predictable name Gradio can serve
    final_output_path = "output.mp4"
    shutil.copy(output_files[0], final_output_path)

    return final_output_path


# Gradio interface
import gradio as gr

demo = gr.Interface(
    fn=detect_traffic_signs,
    inputs=gr.Video(label="Upload Traffic Video"),
    outputs=gr.Video(label="Detected Traffic Signs"),
    title="Traffic Sign Detection",
    description="Upload a traffic video. The model will detect traffic signs and return the video with bounding boxes."
)

demo.launch()


