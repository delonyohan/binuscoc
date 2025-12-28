"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
// import * as ort from 'onnxruntime-web'; // Uncomment when model is ready

interface Detection {
  id: number;
  label: string;
  confidence: number;
  box: [number, number, number, number]; // x, y, w, h
  violation: boolean;
  violationType?: string;
  timestamp: string;
}

const CLASSES = [
  "crop_top", "sleeveless_top", "transparent_top", 
  "ripped_jeans", "short_medium_skirt", "shorts", "opened_foot"
];

const VIOLATION_RULES: Record<string, string> = {
  crop_top: "Rule 1: No Crop Tops",
  transparent_top: "Rule 1: No Transparent Cardigans",
  ripped_jeans: "Rule 2: No Ripped Jeans",
  short_medium_skirt: "Rule 2: Skirts above knee prohibited",
  shorts: "Rule 2: Shorts prohibited",
  opened_foot: "Rule 3: Closed Footwear Must Be Worn"
};

export default function WebcamDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isSimulation, setIsSimulation] = useState(true);
  const [recentDetections, setRecentDetections] = useState<Detection[]>([]);
  const [cameraActive, setCameraActive] = useState(false);

  // Start Camera
  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: 640, height: 640 } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setCameraActive(true);
            videoRef.current?.play();
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please allow permissions.");
      }
    }
  };

  // Mock Detection Logic (Simulation)
  const simulateDetection = useCallback(() => {
    if (!cameraActive || !canvasRef.current || !videoRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Randomly decide to show a detection every few frames
    if (Math.random() > 0.05) { 
        // Keep previous drawing or flicker? Let's just flicker for "scanning" effect or maintain state.
        // For smoother simulation, we usually keep state. But simple random is fine for prototype.
    }
    
    // Generate 0-2 random detections
    const numDetections = Math.floor(Math.random() * 2); 
    const currentDetections: Detection[] = [];

    for (let i = 0; i < numDetections; i++) {
        const classIdx = Math.floor(Math.random() * CLASSES.length);
        const label = CLASSES[classIdx];
        const isViolation = label in VIOLATION_RULES;
        
        const x = Math.random() * (canvasRef.current.width - 100);
        const y = Math.random() * (canvasRef.current.height - 100);
        const w = 100 + Math.random() * 100;
        const h = 100 + Math.random() * 100;

        currentDetections.push({
            id: Date.now() + i,
            label,
            confidence: 0.85 + Math.random() * 0.14,
            box: [x, y, w, h],
            violation: isViolation,
            violationType: VIOLATION_RULES[label],
            timestamp: new Date().toLocaleTimeString()
        });
    }

    // Draw
    currentDetections.forEach(det => {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = det.violation ? 'red' : 'green';
        ctx.rect(det.box[0], det.box[1], det.box[2], det.box[3]);
        ctx.stroke();

        ctx.fillStyle = det.violation ? 'red' : 'green';
        ctx.fillRect(det.box[0], det.box[1] - 25, det.box[2], 25);
        
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(`${det.label} ${(det.confidence * 100).toFixed(1)}%`, det.box[0] + 5, det.box[1] - 7);
    });

    if (currentDetections.length > 0) {
        setRecentDetections(prev => [...currentDetections, ...prev].slice(0, 10));
    }

  }, [cameraActive]);

  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      if (isSimulation) {
        // Slow down simulation update rate
        setTimeout(() => {
            simulateDetection();
             animationFrameId = requestAnimationFrame(loop);
        }, 500); 
      } else {
        // Real detection would go here
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    if (cameraActive) {
        loop();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [cameraActive, isSimulation, simulateDetection]);


  // Initialize
  useEffect(() => {
    startCamera();
    // Try to load model here...
    // If fail: setIsSimulation(true);
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative w-full aspect-square md:aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-gray-700">
        {!cameraActive && (
             <div className="absolute inset-0 flex items-center justify-center text-white">
                <p>Requesting Camera Permission...</p>
             </div>
        )}
        <video 
            ref={videoRef} 
            className="absolute inset-0 w-full h-full object-cover" 
            playsInline 
            muted 
        />
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full" 
            width={640} 
            height={640} 
        />
        
        <div className="absolute top-4 right-4 flex space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${isSimulation ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
                {isSimulation ? "SIMULATION MODE" : "LIVE MODEL"}
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Recent Detections</h3>
            <button onClick={() => setRecentDetections([])} className="text-sm text-blue-500 hover:text-blue-700 flex items-center">
                <RefreshCw className="w-4 h-4 mr-1"/> Clear
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {recentDetections.length === 0 && <p className="text-gray-500 text-center py-4">No detections yet.</p>}
            {recentDetections.map((det) => (
                <div key={det.id} className={`p-3 rounded border-l-4 ${det.violation ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-green-500 bg-green-50 dark:bg-green-900/20'} flex justify-between items-center`}>
                    <div>
                        <div className="font-bold text-gray-900 dark:text-white flex items-center">
                            {det.violation ? <AlertTriangle className="w-4 h-4 text-red-500 mr-2"/> : <CheckCircle className="w-4 h-4 text-green-500 mr-2"/>}
                            {det.label.replace('_', ' ').toUpperCase()}
                        </div>
                        {det.violation && (
                            <div className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1">
                                {det.violationType}
                            </div>
                        )}
                        <div className="text-xs text-gray-500">Confidence: {(det.confidence * 100).toFixed(1)}%</div>
                    </div>
                    <div className="text-xs text-gray-400">{det.timestamp}</div>
                </div>
            ))}
          </div>
      </div>
    </div>
  );
}
