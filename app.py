import os
import cv2
import numpy as np
from ultralytics import YOLO
import gradio as gr

# Load model
model = YOLO("yolov8_low_visibility_trained.pt")

def detect_traffic_signs(video_path):
    if not video_path:
        return "No input video"

    cap = cv2.VideoCapture(video_path)
    width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps    = cap.get(cv2.CAP_PROP_FPS)

    # Use static folder (Hugging Face requirement)
    os.makedirs("static", exist_ok=True)
    output_path = "static/output.mp4"

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = model.predict(frame, conf=0.25, iou=0.5, verbose=False)
        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cls = int(box.cls[0])
                label = model.names[cls]

                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX,
                            0.7, (0, 255, 0), 2)

        out.write(frame)

    cap.release()
    out.release()

    return output_path

# Gradio Interface
with gr.Blocks() as demo:
    gr.Markdown("## 🛑 Traffic Sign Detection (with Classification)")
    gr.Markdown("Upload a traffic video. The model detects and classifies signs into danger, mandatory, etc.")

    video_input = gr.Video(label="Upload Video")
    video_output = gr.Video(label="Detected Video")

    run_btn = gr.Button("Detect Traffic Signs")
    run_btn.click(fn=detect_traffic_signs, inputs=video_input, outputs=video_output)

demo.launch()
