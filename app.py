import os
import glob
from ultralytics import YOLO

model = YOLO("yolov8_low_visibility_trained.pt")  # or your model file

def detect_traffic_signs(video_path):
    if not video_path:
        return "No video provided."

    # Run detection (save=True makes video saved to runs/detect/predictX/)
    model.predict(
        source=video_path,
        save=True,
        save_conf=True,
        conf=0.25,
        iou=0.5
    )

    # Get latest output video file (e.g., runs/detect/predict/video.mp4)
    latest_dir = sorted(glob.glob("runs/detect/predict*"), key=os.path.getmtime)[-1]
    output_videos = glob.glob(os.path.join(latest_dir, "*.mp4"))
    
    if not output_videos:
        return "Error: No output video found."
    
    return output_videos[0]
