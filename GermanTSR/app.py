import cv2
import numpy as np
from ultralytics import YOLO
import gradio as gr

# Load the trained YOLOv8 model
model = YOLO("yolov8_low_visibility_trained.pt")

# --- Image Detection ---
def detect_traffic_signs_image(image):
    if image is None:
        return None, "No input image"

    results = model.predict(image, conf=0.25, iou=0.5)
    boxes = results[0].boxes.xyxy.cpu().numpy()
    class_ids = results[0].boxes.cls.cpu().numpy().astype(int)
    confidences = results[0].boxes.conf.cpu().numpy()  # Extract confidence scores

    if len(boxes) == 0:
        return None, "No traffic signs detected"

    image_copy = image.copy()
    detection_texts = []

    for i, box in enumerate(boxes):
        x1, y1, x2, y2 = map(int, box[:4])
        label = model.names[class_ids[i]]  # Get class name
        confidence = confidences[i]  # Get confidence score

        cv2.rectangle(image_copy, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(image_copy, f"{label} ({confidence:.2f})", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

        detection_texts.append(f"{label}: {confidence:.2f}")

    return image_copy, "\n".join(detection_texts)

# --- Gradio UI ---
with gr.Blocks() as demo:
    gr.Markdown("## 🛑 Traffic Sign Detection App")
    gr.Markdown("Upload an image to detect traffic signs using a YOLOv8 model.")

    with gr.Tab("📷 Image Detection"):
        input_image = gr.Image(type="numpy", label="Upload Image")
        output_image = gr.Image(label="Detected Image")
        detection_result = gr.Textbox(label="Detection Result")  

        detect_btn = gr.Button("Detect Traffic Signs")
        detect_btn.click(fn=detect_traffic_signs_image, inputs=input_image, outputs=[output_image, detection_result])

    gr.Markdown("---\nBuilt with ❤ using YOLOv8, Gradio, and OpenCV")

demo.launch()
