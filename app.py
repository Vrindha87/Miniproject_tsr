import gradio as gr
from ultralytics import YOLO
import os

# Load the trained model
model_path = "yolov8_low_visibility_trained.pt"  # Ensure this file is in the same directory
model = YOLO(model_path)

def detect_traffic_signs(video):
    if not video:
        return None

    video_path = video  # ✅ Get raw path instead of video.name

    # YOLO output folder
    output_folder = "runs/detect/predict"
    os.makedirs(output_folder, exist_ok=True)

    # Run prediction
    results = model.predict(video_path, save=True, conf=0.25, iou=0.5)

    # Find output .mp4 file
    detected_video = None
    for root, _, files in os.walk(output_folder):
        for file in files:
            if file.endswith(".mp4"):
                detected_video = os.path.join(root, file)
                break

    return detected_video

# Create Gradio Interface
demo = gr.Interface(
    fn=detect_traffic_signs,
    inputs=gr.Video(label="Upload Traffic Video"),
    outputs=gr.Video(label="Detected Traffic Signs"),
    title="Traffic Sign Detection",
    description="Upload a traffic video, and the model will detect the signs!"
)

# Run the app
demo.launch(share=True)
