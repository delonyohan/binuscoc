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
    print(f"Site packages paths: {site_packages_paths}", file=sys.stderr)
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
import cv2
import numpy as np
from ultralytics import YOLO
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
MODEL_PATH = "/tmp/yolov8s.pt"
model = None

# This block runs once when the serverless function is initialized
if model is None:
    MODEL_URL = os.environ.get("MODEL_URL")
    if MODEL_URL and not os.path.exists(MODEL_PATH):
        print(f"Downloading model from {MODEL_URL}...")
        try:
            response = requests.get(MODEL_URL, stream=True)
            response.raise_for_status()
            with open(MODEL_PATH, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print("Model downloaded successfully.")
        except Exception as e:
            print(f"FATAL: Failed to download model. Error: {e}")

    # Load the YOLOv8 model, but handle the case where it doesn't exist
    if os.path.exists(MODEL_PATH):
        try:
            model = YOLO(MODEL_PATH)
            print("YOLOv8 model loaded successfully.")
        except Exception as e:
            print(f"FATAL: Model could not be loaded from {MODEL_PATH}. Error: {e}")
    else:
        print("FATAL: Model file not found and could not be downloaded.")


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
    if not model:
        raise HTTPException(status_code=503, detail="Model is not loaded or failed to load. Check server logs.")

    # Decode the base64 image
    try:
        image_data = re.sub('^data:image/.+;base64,', '', payload.image)
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image data")

    if img is None:
        raise HTTPException(status_code=400, detail="Could not decode image")

    # Perform inference
    results = model(img)

    # Extract and format detections
    detections = []
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            class_id = int(box.cls[0])
            detections.append(Detection(
                id=str(uuid.uuid4()),
                timestamp=int(box.cls[0]), # Placeholder
                type=model.names[class_id],
                confidence=float(box.conf[0]),
                boundingBox=BoundingBox(
                    x=int(x1),
                    y=int(y1),
                    width=int(x2 - x1),
                    height=int(y2 - y1)
                )
            ))
    
    return {"detections": detections}