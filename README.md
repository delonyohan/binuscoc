# binuscoc - AI-Powered Dress Code Enforcement

<div align="center">
  <img width="800" alt="binuscoc application screenshot" src="https://via.placeholder.com/800x400.png?text=App+Screenshot+Here" />
</div>

## About The Project

`binuscoc` is a modern, AI-powered application designed to automate dress code monitoring and enforcement in real-time. It leverages computer vision to analyze video streams and identify whether individuals are adhering to predefined dress code policies.

This system is ideal for universities, corporate environments, and events where specific attire is required. It provides a live monitoring dashboard, historical metrics, and a management interface for the computer vision models.

### Key Features

- **Live Monitoring:** Real-time video analysis from camera feeds to detect dress code violations.
- **Dashboard & Metrics:** Visualize historical data, track violation rates, and analyze trends.
- **Model Management:** Interface to manage and update the underlying computer vision models.
- **Built with Modern Tech:** A responsive frontend built with React and Vite, a powerful Python backend, and containerized with Docker.

## Getting Started

This guide will help you set up the project for local development and testing.

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (v18 or later)

### Local Development

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/delonyohan/binuscoc.git
    cd binuscoc
    ```

2.  **Run with Docker Compose:**
    For a development environment with hot-reloading, use the `docker-compose.dev.yml` file.
    ```sh
    docker-compose -f docker-compose.dev.yml up --build
    ```
    - The frontend will be available at `http://localhost:3000`.
    - The backend API will be available at `http://localhost:8501`.

3.  **Run in Production Mode:**
    To simulate the production environment, use the standard `docker-compose.yml` file.
    ```sh
    docker-compose up --build
    ```
    - The application will be served by Nginx at `http://localhost:80`.

## Project Structure

The project is organized into two main parts in a monorepo structure:

-   `./frontend`: Contains the React/Vite single-page application.
-   `./backend`: Contains the Python/FastAPI serverless functions for the API.
-   `./preprocess-YOLOV8`: Contains scripts and data related to the YOLOv8 model preprocessing.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please fork the repo and create a pull request.

## License

Distributed under the MIT License. See `frontend/pages/LicenseInfo.tsx` for more information.
