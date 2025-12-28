"use client";

import React, { useRef, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw, Zap, Video, VideoOff, AlertOctagon, Activity } from 'lucide-react';
import * as ort from 'onnxruntime-web';
import { preprocess, postprocess } from '@/utils/modelHelper';

// Force WASM paths to public root
ort.env.wasm.wasmPaths = "/"; 
ort.env.logLevel = 'error'; 
ort.env.wasm.numThreads = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4;

interface Detection {
  id: string; // Changed to string for UUID
  label: string;
  confidence: number;
  box: [number, number, number, number]; 
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
  
  // States
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [recentDetections, setRecentDetections] = useState<Detection[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [inferenceTime, setInferenceTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const sessionRef = useRef<ort.InferenceSession | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize Camera
  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment', 
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          } 
        });
        streamRef.current = stream;
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
        setCameraEnabled(false);
      }
    }
  };

  const stopCamera = () => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
      }
      if (videoRef.current) {
          videoRef.current.srcObject = null;
      }
      setCameraActive(false);
  };

  const toggleCamera = () => {
      if (cameraEnabled) {
          stopCamera();
          setCameraEnabled(false);
      } else {
          setCameraEnabled(true);
          startCamera();
      }
  };

  const updateStats = (newDetections: any[]) => {
      if (newDetections.length === 0) return;

      const currentStats = localStorage.getItem("binuscoc_stats");
      const stats = currentStats ? JSON.parse(currentStats) : { totalDetections: 0, violationsToday: 0, cropTop: 0, shorts: 0, openFoot: 0 };
      
      newDetections.forEach(det => {
          stats.totalDetections += 1;
          
          if (det.label in VIOLATION_RULES) {
              stats.violationsToday += 1;
              if (det.label === 'crop_top') stats.cropTop += 1;
              if (det.label === 'shorts' || det.label === 'short_medium_skirt') stats.shorts += 1;
              if (det.label === 'opened_foot') stats.openFoot += 1;
          }
      });

      localStorage.setItem("binuscoc_stats", JSON.stringify(stats));
  };

  // Load ONNX Model
  useEffect(() => {
    const loadModel = async () => {
        try {
            console.log("Loading YOLOv5s ONNX model...");
            const session = await ort.InferenceSession.create('/yolov5s.onnx', {
                 executionProviders: ['wasm'],
                 graphOptimizationLevel: 'all'
            });
            sessionRef.current = session;
            setIsModelLoaded(true);
            console.log("Model loaded successfully!");
        } catch (e: any) {
            console.error("Failed to load model:", e);
            setModelError(e.message || "Failed to load model");
        }
    };

    loadModel();
    if (cameraEnabled) startCamera();

    return () => stopCamera();
  }, []);

  // Inference Loop
  useEffect(() => {
    let animationFrameId: number;
    let isBusy = false;

    const runInference = async () => {
        if (!isModelLoaded || !sessionRef.current || !videoRef.current || !canvasRef.current || !cameraActive || isBusy) {
            animationFrameId = requestAnimationFrame(runInference);
            return;
        }

        if (videoRef.current.readyState !== 4) {
            animationFrameId = requestAnimationFrame(runInference);
            return;
        }

        isBusy = true;
        setIsProcessing(true);
        const start = performance.now();
        
        try {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                const vWidth = videoRef.current.videoWidth;
                const vHeight = videoRef.current.videoHeight;
                
                if (canvasRef.current.width !== vWidth) canvasRef.current.width = vWidth;
                if (canvasRef.current.height !== vHeight) canvasRef.current.height = vHeight;

                const tensor = await preprocess(ctx, vWidth, vHeight);

                const feeds: Record<string, ort.Tensor> = {};
                feeds[sessionRef.current.inputNames[0]] = tensor;
                const results = await sessionRef.current.run(feeds);

                const detections = postprocess(results, vWidth, vHeight, CLASSES);

                ctx.clearRect(0, 0, vWidth, vHeight);
                
                const newDetections: Detection[] = [];

                detections.forEach((det: any) => {
                    const [x, y, w, h] = det.box;
                    const isViolation = det.label in VIOLATION_RULES;
                    
                    ctx.strokeStyle = isViolation ? '#ef4444' : '#22c55e';
                    ctx.lineWidth = 4;
                    ctx.strokeRect(x, y, w, h);

                    ctx.fillStyle = isViolation ? '#ef4444' : '#22c55e';
                    const text = `${det.label} ${(det.confidence * 100).toFixed(1)}%`;
                    const textWidth = ctx.measureText(text).width;
                    ctx.fillRect(x, y - 25, textWidth + 10, 25);

                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 16px Arial';
                    ctx.fillText(text, x + 5, y - 7);

                    newDetections.push({
                        id: crypto.randomUUID(), // Unique Key Fix
                        label: det.label,
                        confidence: det.confidence,
                        box: det.box,
                        violation: isViolation,
                        violationType: VIOLATION_RULES[det.label],
                        timestamp: new Date().toLocaleTimeString()
                    });
                });

                if (newDetections.length > 0) {
                    setRecentDetections(prev => [...newDetections, ...prev].slice(0, 20));
                    updateStats(newDetections);
                }
            }

            setInferenceTime(performance.now() - start);

        } catch (e) {
            console.error("Inference error:", e);
        } finally {
            isBusy = false;
            setIsProcessing(false);
            animationFrameId = requestAnimationFrame(runInference);
        }
    };

    if (isModelLoaded && cameraActive) {
        runInference();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isModelLoaded, cameraActive]);


  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${cameraActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {cameraActive ? "Camera Active" : "Camera Off"}
                  </span>
              </div>
              {isProcessing && (
                  <div className="flex items-center space-x-2 text-xs font-mono text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                      <Activity className="w-3 h-3 animate-spin" />
                      <span>PROCESSING</span>
                  </div>
              )}
          </div>
          <button 
            onClick={toggleCamera}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                cameraEnabled 
                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
            }`}
          >
              {cameraEnabled ? <VideoOff className="w-4 h-4 mr-2"/> : <Video className="w-4 h-4 mr-2"/>}
              {cameraEnabled ? "Turn Off" : "Turn On"}
          </button>
      </div>

      <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 aspect-video">
        {!isModelLoaded && !modelError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                <p className="font-semibold animate-pulse">Initializing Neural Engine...</p>
            </div>
        )}

        {modelError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-900/90 text-white p-6 text-center">
                <AlertOctagon className="w-16 h-16 mb-4 text-red-200" />
                <h3 className="text-xl font-bold mb-2">Model Failed to Load</h3>
                <p className="text-sm opacity-80">{modelError}</p>
            </div>
        )}

        {!cameraActive && !modelError && (
             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white bg-gray-900">
                <div className="p-4 bg-gray-800 rounded-full mb-4">
                    <VideoOff className="w-8 h-8 text-gray-400"/>
                </div>
                <p className="text-gray-400 font-medium">Camera is turned off</p>
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
            className="absolute inset-0 w-full h-full pointer-events-none" 
        />
        
        {/* HUD Info */}
        {cameraActive && (
            <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-mono backdrop-blur-sm border border-white/10 flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${isModelLoaded ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                    {isModelLoaded ? "AI ACTIVE" : "INITIALIZING"}
                </div>
                {isModelLoaded && (
                    <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-mono backdrop-blur-sm border border-white/10 flex items-center">
                        <Zap className="w-3 h-3 mr-1 text-yellow-400"/>
                        {inferenceTime.toFixed(1)}ms
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Detection Log */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-100 dark:border-gray-800">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                Live Detection Log
            </h3>
            <button 
                onClick={() => setRecentDetections([])} 
                className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors flex items-center"
            >
                <RefreshCw className="w-3 h-3 mr-1"/> Reset
            </button>
          </div>
          
          <div className="p-0 overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                {recentDetections.length === 0 ? (
                    <div className="py-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                            <CheckCircle className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">No violations detected currently.</p>
                        <p className="text-gray-400 text-xs mt-1">System is scanning the feed...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {recentDetections.map((det) => (
                            <div key={det.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start">
                                        <div className={`mt-1 p-1.5 rounded-full mr-3 ${det.violation ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {det.violation ? <AlertTriangle className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900 dark:text-white capitalize">
                                                {det.label.replace('_', ' ')}
                                            </h4>
                                            {det.violation && (
                                                <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-0.5">
                                                    {det.violationType}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-1">
                                                Confidence: <span className="font-mono text-gray-600 dark:text-gray-300">{(det.confidence * 100).toFixed(1)}%</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">{det.timestamp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
      </div>
    </div>
  );
}