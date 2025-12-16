from fastapi import FastAPI
from pydantic import BaseModel
import cv2
import numpy as np
from ultralytics import YOLO
import base64
import re
import uuid

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
# Load the YOLOv8 model from a local path
# This path should be accessible from within the container.
# In docker-compose, ./preprocess-YOLOV8 is mounted.
MODEL_PATH = "preprocess-YOLOV8/runs/detect/train/weights/best.pt"
model = YOLO(MODEL_PATH)


# --- API Endpoints ---
@app.get("/api")
def read_root():
    return {"status": "ok"}

@app.post("/api/predict", response_model=PredictionResponse)
async def predict(payload: ImagePayload):
    """
    Accepts a base64 encoded image, runs YOLOv8 inference,
    and returns detected violations.
    """
    # Decode the base64 image
    try:
        # Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        image_data = re.sub('^data:image/.+;base64,', '', payload.image)
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception as e:
        return {"detections": []} # Return empty if image is invalid

    if img is None:
        return {"detections": []}

    # Perform inference
    results = model(img)

    # Extract and format detections
    detections = []
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            class_id = int(box.cls[0])
            detections.append(Detection(
                id=str(uuid.uuid4()), # Generate a unique ID for each detection
                timestamp=int(box.cls[0]), # Placeholder, consider adding a real timestamp
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