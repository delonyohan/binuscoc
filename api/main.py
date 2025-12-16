from fastapi import FastAPI, WebSocket
from starlette.websockets import WebSocketDisconnect
import cv2
import numpy as np
from ultralytics import YOLO
from vercel_blob import blob
import os

app = FastAPI()

# Get the model URL from environment variable
MODEL_URL = os.environ.get("MODEL_URL")
model_path = "/tmp/yolov8n.pt"

# Download the model from Vercel Blob
if MODEL_URL:
    with open(model_path, "wb") as f:
        f.write(blob.download(MODEL_URL))

# Load the YOLOv8 model
model = YOLO(model_path)

@app.websocket("/api/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive image data from the client
            data = await websocket.receive_bytes()
            
            # Convert the received bytes to a NumPy array
            nparr = np.frombuffer(data, np.uint8)
            
            # Decode the image
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            # Perform inference
            results = model(img)

            # Extract detections
            detections = []
            for result in results:
                for box in result.boxes:
                    x1, y1, x2, y2 = box.xyxy[0]
                    detections.append({
                        "id": str(box.cls[0]),
                        "timestamp": 0, # Add timestamp if needed
                        "type": model.names[int(box.cls[0])],
                        "confidence": float(box.conf[0]),
                        "boundingBox": {
                            "x": int(x1),
                            "y": int(y1),
                            "width": int(x2 - x1),
                            "height": int(y2 - y1)
                        }
                    })
            
            await websocket.send_json({"detections": detections})

    except WebSocketDisconnect:
        print("Client disconnected")