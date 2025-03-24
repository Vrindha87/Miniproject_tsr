import gradio as gr
from ultralytics import YOLO
import os

# Load your trained model
model = YOLO("yolov8_low_visibility_trained.pt")

def detect_traffic_signs(video_path):
    try:
        print("📥 Video input received:", video_path)

        # Run prediction
        results = model.predict(video_path, conf=0.25, iou=0.5)

        # Save the prediction video to known path
        output_path = "output_detected.mp4"
        results[0].save(filename=output_path)

        # Check if file was saved
        if os.path.exists(output_path):
            print("✅ Output video saved:", output_path)
            return output_path
        else:
            print("❌ Failed to save output.")
            return None
    except Exception as e:
        print("❌ ERROR:", e)
        return None

demo = gr.Interface(
    fn=detect_traffic_signs,
    inputs=gr.Video(label="Upload Traffic Video"),
    outputs=gr.Video(label="Detected Traffic Signs"),
    title="Traffic Sign Detection",
    description="Upload a traffic video, and the model will detect the signs!"
)

demo.launch()
