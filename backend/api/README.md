---
title: Binus Coc Backend
emoji: 🚀
color_map:
  - blue
  - white
sdk: fastapi
app_file: app.py
app_port: 7860
---

# Binus Coc Backend (FastAPI)

This is the FastAPI backend for the Binus Coc application, designed to perform YOLOv8 object detection.

## Deployment on Hugging Face Spaces

This Space deploys a FastAPI application. The `app.py` file contains the main FastAPI application.

### Environment Variables (for .env file in Hugging Face Space settings)

*   `MODEL_URL`: URL to the `yolov8s.pt` model file. This model will be downloaded by the application during startup.
