# BINUSCOC - Campus Outfit Check

## Overview
BINUSCOC is a real-time outfit detection system designed to monitor dress code compliance at Bina Nusantara University. It uses a YOLOv5 Deep Learning model integrated into a Next.js web application.

## Features
1. **Dashboard**: Live statistics and violation trends.
2. **Live Monitor**: Real-time camera detection (Simulated or ONNX-based).
3. **Model Manager**: Performance metrics of the deep learning model.
4. **Policy Info**: Digital handbook of campus dress codes.
5. **License & Info**: System details.

## Project Structure
- `binuscoc-app/`: The Next.js Web Application (Frontend).
- `Clothing-Detection-with-YOLOV8-main/`: The original dataset and training scripts.

## Getting Started

### 1. Web Application
Prerequisites: Node.js installed.

```bash
cd binuscoc-app
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Deep Learning Model
The app runs in **Simulation Mode** by default. To enable real AI detection:

1.  Convert your `yolov5s.pt` to ONNX format.
    You can use the official YOLOv5 export script:
    ```bash
    pip install ultralytics  # or install yolov5 requirements
    python export.py --weights yolov5s.pt --include onnx
    ```
2.  Rename the output file to `model.onnx`.
3.  Place `model.onnx` inside `binuscoc-app/public/`.
4.  The app will automatically detect the model (uncomment the ONNX loading lines in `components/WebcamDetector.tsx` to fully enable).

## License
MIT License
