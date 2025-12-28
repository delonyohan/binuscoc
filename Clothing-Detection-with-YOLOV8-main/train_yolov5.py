import os
import sys
import subprocess

YOLOV5_DIR = "yolov5"
DATA_YAML = "clothing-detection-dataset/yolo_data.yaml"
WEIGHTS = "yolov5s.pt"

assert os.path.exists(YOLOV5_DIR), "YOLOv5 folder not found"
assert os.path.exists(DATA_YAML), "Dataset YAML not found"

command = [
    sys.executable,
    f"{YOLOV5_DIR}/train.py",
    "--img", "640",
    "--batch", "8",
    "--epochs", "50",
    "--data", DATA_YAML,
    "--weights", WEIGHTS,
    "--device", "cpu"
]

print("Training YOLOv5...")
subprocess.run(command, check=True)
