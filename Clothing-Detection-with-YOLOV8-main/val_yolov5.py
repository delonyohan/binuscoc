import os
import sys

PYTHON = sys.executable

cmd = f"""
{PYTHON} yolov5/val.py \
--weights yolov5/runs/train/exp2/weights/best.pt \
--data clothing-detection-dataset/yolo_data.yaml \
--img 640
"""

print("Validating model...")
os.system(cmd)
