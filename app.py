import gradio as gr
from ultralytics import YOLO
import cv2

# Load the trained model
model = YOLO("yolov8_low_visibility_trained.pt")  # Ensure this file is in your space

# Function to run model on video
def detect_traffic_signs(video):
    results = model.predict(video, save=True, conf=0.25, iou=0.5)
    return results[0].save_path  # Return the path of detected video

# Gradio interface
demo = gr.Interface(
    fn=detect_traffic_signs,
    inputs=gr.Video(label="Upload Traffic Video"),
    outputs=gr.Video(label="Detected Traffic Signs"),
    title="Traffic Sign Detection",
    description="Upload a traffic video, and the model will detect the signs!"
)

demo.launch()
