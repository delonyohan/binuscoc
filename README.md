# BINUSCOC - Campus Outfit Check

## Overview
BINUSCOC is a real-time outfit detection system designed to monitor dress code compliance at Bina Nusantara University. It uses a YOLOv5 Deep Learning model integrated into a Next.js web application.

## Features
1. **Dashboard**: Live statistics and violation trends.
2. **Live Monitor**: Real-time camera detection (uses `yolov5s.onnx`).
3. **Model Manager**: Performance metrics of the deep learning model.
4. **Policy Info**: Digital handbook of campus dress codes.
5. **License & Info**: System details.

## Project Structure
- `binuscoc-app/`: The Next.js Web Application (Frontend).
- `Clothing-Detection-with-YOLOV8-main/`: The original dataset and training scripts.

## Getting Started

### Web Application
Prerequisites: Node.js installed.

```bash
cd binuscoc-app
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

The application is pre-configured to load the model from `public/yolov5s.onnx`.

## License
MIT License
