import gradio as gr
from ultralytics import YOLO
import os

# Load the trained model
model_path = "yolov8_low_visibility_trained.pt"  # Make sure this is in the same folder
model = YOLO(model_path)

# Detection function
def detect_traffic_signs(video):
    if not video:
        return "No video input provided."

    video_path = video  # FIXED: Gradio passes file path as string

    # Run YOLOv8 prediction
    results = model.predict(
        source=video_path,
        save=True,
        save_conf=True,
        conf=0.25,
        iou=0.5,
        stream=False
    )

    # Find the output video path
    output_dir = model.predictor.save_dir
    output_video = None
    for f in os.listdir(output_dir):
        if f.endswith(".mp4"):
            output_video = os.path.join(output_dir, f)
            break

    if output_video is None:
        return "Error: No video output found."

    return output_video

# Gradio Interface
demo = gr.Interface(
    fn=detect_traffic_signs,
    inputs=gr.Video(label="Upload Traffic Video"),
    outputs=gr.Video(label="Detected Traffic Signs"),
    title="Traffic Sign Detection",
    description="Upload a traffic video. The model will detect and return the annotated video."
)

# Launch with sharing
demo.launch(share=True)
