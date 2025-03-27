import os
import cv2
import glob
import shutil
import numpy as np
from ultralytics import YOLO
import gradio as gr

# Load your trained model
model = YOLO("yolov8_low_visibility_trained.pt")

# --- Image Detection ---
def detect_traffic_signs_image(image):
    if image is None:
        return "No input image"
    
    results = model.predict(image, conf=0.25, iou=0.5)
    boxes = results[0].boxes.xyxy.cpu().numpy()
    class_ids = results[0].boxes.cls.cpu().numpy().astype(int)
    
    for i, box in enumerate(boxes):
        x1, y1, x2, y2 = map(int, box[:4])
        label = model.names[class_ids[i]]  # ✅ Get class name
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(image, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
    
    return image

# --- Gradio UI ---
with gr.Blocks() as demo:
    gr.Markdown("## 🛑 Traffic Sign Detection App")
    gr.Markdown("Upload an image or video to detect traffic signs using a YOLOv8 model.")
    
    with gr.Tab("📷 Image Detection"):
        input_image = gr.Image(type="numpy", label="Upload Image")
        output_image = gr.Image(label="Detected Image")
        detect_btn = gr.Button("Detect Traffic Signs")
        detect_btn.click(fn=detect_traffic_signs_image, inputs=input_image, outputs=output_image)
    
    gr.Markdown("---\nBuilt with ❤ using YOLOv8, Gradio, and OpenCV")

demo.launch()
