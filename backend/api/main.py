from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import cv2
import numpy as np
from ultralytics import YOLO
import base64
import re
import uuid
import os
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
MODEL_PATH = "/tmp/best.pt"

# Download the model from the URL specified in the environment variable
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
        # If the model fails to download, the app can't start.
        # This will cause a runtime error on Vercel, which is appropriate.

# Load the YOLOv8 model, but handle the case where it doesn't exist
try:
    model = YOLO(MODEL_PATH)
    print("YOLOv8 model loaded successfully.")
except Exception as e:
    model = None
    print(f"FATAL: Model could not be loaded from {MODEL_PATH}. Error: {e}")


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
        raise HTTPException(status_code=500, detail="Model is not loaded. Check server logs for errors.")

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