import time
import os
import site
import sys

# --- Deployment Size Debugging ---
# This code will run when Vercel builds the function.
# It inspects the installed packages to find what is taking up space.
print("--- Vercel Deployment Debugger: Inspecting Python Environment ---", file=sys.stderr)
total_size = 0
try:
    site_packages_paths = site.getsitepackages()
    print(f"Site packages paths: {site_packages_path}", file=sys.stderr)
    for site_packages_path in site_packages_paths:
        print(f"Walking site-packages at: {site_packages_path}", file=sys.stderr)
        for root, dirs, files in os.walk(site_packages_path):
            for name in files:
                path = os.path.join(root, name)
                try:
                    size = os.path.getsize(path)
                    total_size += size
                    if size > 10 * 1024 * 1024: # if file > 10MB
                        print(f"--> LARGE FILE: {path}, Size: {size / 1024 / 1024:.2f} MB", file=sys.stderr)
                except OSError:
                    pass
    print(f"--- TOTAL SITE-PACKAGES SIZE: {total_size / 1024 / 1024:.2f} MB ---", file=sys.stderr)
except Exception as e:
    print(f"--- Error during debug walk: {e} ---", file=sys.stderr)
# --- End Debugging ---


from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
# import cv2 # Commented out for now
# import numpy as np # Commented out for now
# from ultralytics import YOLO # Commented out for now
import base64
import re
import uuid
import requests

app = FastAPI()

# --- Pydantic Models ---
class ImagePayload(BaseModel):
    image: str

class BoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int

class Detection(BaseModel):
    id: str
    timestamp: int
    type: str
    confidence: float
    boundingBox: BoundingBox

class PredictionResponse(BaseModel):
    detections: list[Detection]

# --- Model Loading ---
# MODEL_PATH = "/tmp/yolov8s.pt" # Commented out
model = None # Model loading disabled

# This block runs once when the serverless function is initialized
# if model is None: # Commented out
#     MODEL_URL = os.environ.get("MODEL_URL") # Commented out
#     if MODEL_URL and not os.path.exists(MODEL_PATH): # Commented out
#         print(f"Downloading model from {MODEL_URL}...") # Commented out
#         try: # Commented out
#             response = requests.get(MODEL_URL, stream=True) # Commented out
#             response.raise_for_status() # Commented out
#             with open(MODEL_PATH, "wb") as f: # Commented out
#                 for chunk in response.iter_content(chunk_size=8192): # Commented out
#                     f.write(chunk) # Commented out
#             print("Model downloaded successfully.") # Commented out
#         except Exception as e: # Commented out
#             print(f"FATAL: Failed to download model. Error: {e}") # Commented out

#     # Load the YOLOv8 model, but handle the case where it doesn't exist
#     if os.path.exists(MODEL_PATH): # Commented out
#         try: # Commented out
#             model = YOLO(MODEL_PATH) # Commented out
#             print("YOLOv8 model loaded successfully.") # Commented out
#         except Exception as e: # Commented out
#             print(f"FATAL: Model could not be loaded from {MODEL_PATH}. Error: {e}") # Commented out
#     else: # Commented out
#         print("FATAL: Model file not found and could not be downloaded.") # Commented out


# --- API Endpoints ---
@app.get("/api")
def read_root():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/api/predict", response_model=PredictionResponse)
async def predict(payload: ImagePayload):
    """
    Accepts a base64 encoded image, runs YOLOv8 inference,
    and returns detected violations.
    """
    raise HTTPException(status_code=501, detail="Model inference is temporarily disabled for deployment testing.")