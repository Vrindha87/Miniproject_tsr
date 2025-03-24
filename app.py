import gradio as gr
from ultralytics import YOLO
import os
import cv2
import numpy as np

# ==== Load Model ====
model = YOLO("yolov8_low_visibility_trained.pt")  # Make sure this file is uploaded!

# ==== Detection Function ====
def detect_traffic_signs(video):
    if video is None:
        return None

    # Step 1: Get path of uploaded video
    video_path = video.name

    # Step 2: Run YOLO prediction with stream=True
    results = model.predict(source=video_path, stream=True, conf=0.25, iou=0.5)

    # Step 3: Prepare to save frames
    frame_list = []
    for result in results:
        im_array = result.plot()  # This draws boxes on the image
        frame_list.append(im_array)

    if not frame_list:
        return None  # No detections at all

    # Step 4: Save the new video using OpenCV
    height, width, _ = frame_list[0].shape
    output_path = "detected_video.mp4"
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, 20.0, (width, height))

    for frame in frame_list:
        out.write(frame)

    out.release()

    return output_path  # Return video path

# ==== Gradio UI ====
demo = gr.Interface(
    fn=detect_traffic_signs,
    inputs=gr.Video(label="Upload Traffic Video"),
    outputs=gr.Video(label="Detected Traffic Signs"),
    title="Traffic Sign Detection",
    description="Upload a traffic video, and the model will detect the signs!"
)

# ==== Launch ====
demo.launch()
