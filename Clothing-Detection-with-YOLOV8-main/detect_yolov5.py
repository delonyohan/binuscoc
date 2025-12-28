import os
import sys

PYTHON = sys.executable

cmd = f"""
{PYTHON} yolov5/detect.py \
--weights yolov5/runs/train/exp2/weights/best.pt \
--source clothing-detection-dataset/split_dataset/val/images \
--conf 0.25 \
--name dressguard_test
"""

print("Running detection...")
os.system(cmd)
