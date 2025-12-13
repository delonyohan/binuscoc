import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Detection, ViolationType } from '../types';

// Placeholder image for snapshots
const SNAPSHOT_PLACEHOLDER = 'https://picsum.photos/320/240';

export const LiveMonitor: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ws = useRef<WebSocket | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Start Camera & WebSocket
  const startCamera = async () => {
    setIsLoading(true);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 }, 
            audio: false 
        });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play();
                setIsStreamActive(true);
                setIsLoading(false);
            };
        }

        // Initialize WebSocket connection
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws.current = new WebSocket(`${wsProtocol}//${window.location.host}/api/ws`);

        ws.current.onopen = () => {
            console.log("WebSocket connection established");
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.detections) {
                setDetections(data.detections);
            }
        };

        ws.current.onclose = () => {
            console.log("WebSocket connection closed");
        };

    } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please check permissions.");
        setIsLoading(false);
    }
  };

  const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
          setIsStreamActive(false);
      }
      if (ws.current) {
          ws.current.close();
      }
  };

  // Send video frames to backend
  useEffect(() => {
    let interval: number;

    if (isStreamActive && ws.current) {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (video && ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            interval = window.setInterval(() => {
                if (ws.current?.readyState === WebSocket.OPEN) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            ws.current?.send(blob);
                        }
                    }, 'image/jpeg', 0.8);
                }
            }, 100);
        }
    }

    return () => clearInterval(interval);
  }, [isStreamActive]);

  // Draw Bounding Boxes
  const drawDetections = useCallback(() => {
      if (!canvasRef.current || !videoRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Match canvas size to video size
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Define colors for different violation types
      const violationColors: Record<ViolationType, string> = {
          [ViolationType.SHORTS]: '#facc15', // Yellow
          [ViolationType.SANDALS]: '#f97316', // Orange
          [ViolationType.SLEEVELESS]: '#ef4444', // Red
          // Add more as needed
      };

      detections.forEach(det => {
          const { x, y, width, height } = det.boundingBox;
          const color = violationColors[det.type] || '#a855f7'; // Default to purple

          // Draw Box
          ctx.strokeStyle = color;
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y, width, height);

          // Draw Label Background
          const label = `${det.type} (${(det.confidence * 100).toFixed(0)}%)`;
          ctx.font = 'bold 16px Inter';
          const textMetrics = ctx.measureText(label);
          const textWidth = textMetrics.width;
          const textHeight = 20; // Approximate height for 16px font

          ctx.fillStyle = color;
          ctx.fillRect(x, y - textHeight - 10, textWidth + 20, textHeight + 10); // Padding for text

          // Draw Text
          ctx.fillStyle = 'white';
          ctx.fillText(label, x + 10, y - 10);
      });
  }, [detections]);

  // Animation Loop for Drawing
  useEffect(() => {
      let animationFrameId: number;
      
      const render = () => {
          drawDetections();
          animationFrameId = requestAnimationFrame(render);
      };

      if (isStreamActive) {
          render();
      }

      return () => cancelAnimationFrame(animationFrameId);
  }, [isStreamActive, drawDetections]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Live Monitoring</h1>
          <p className="text-slate-500">Real-time inferencing connected to Camera #01</p>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={isStreamActive ? stopCamera : startCamera}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                    isStreamActive 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
            >
                {isStreamActive ? 'Stop Stream' : 'Start Camera'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Feed */}
        <div className="lg:col-span-2 relative bg-black rounded-xl overflow-hidden shadow-lg aspect-video flex items-center justify-center">
            {isLoading && (
                <div className="text-white flex flex-col items-center">
                    <i className="fas fa-spinner fa-spin text-4xl mb-2"></i>
                    <span>Starting camera...</span>
                </div>
            )}
            {!isStreamActive && !isLoading && (
                <div className="text-slate-500 flex flex-col items-center">
                    <i className="fas fa-video-slash text-4xl mb-2"></i>
                    <span>Camera Offline</span>
                </div>
            )}
            <video 
                ref={videoRef} 
                className={`absolute inset-0 w-full h-full object-cover ${!isStreamActive ? 'hidden' : ''}`}
                muted
                playsInline
            />
            <canvas 
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />
            
            {/* Live Indicator */}
            {isStreamActive && (
                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                    LIVE
                </div>
            )}
        </div>

        {/* Sidebar: Recent Detections */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700">Recent Violations</h3>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">Today</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {detections.length > 0 ? (
                    detections.map((det) => (
                        <div key={det.id} className="flex gap-3 items-start p-3 bg-red-50 border border-red-100 rounded-lg animate-fade-in">
                            <img src={SNAPSHOT_PLACEHOLDER} alt="snapshot" className="w-16 h-16 rounded object-cover bg-slate-200" />
                            <div>
                                <p className="font-bold text-slate-800">{det.type}</p>
                                <p className="text-xs text-slate-500">Confidence: {(det.confidence * 100).toFixed(1)}%</p>
                                <p className="text-xs text-slate-400 mt-1">{new Date(det.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-slate-400 mt-10">
                        <p>No active violations detected.</p>
                        <p className="text-xs mt-2">System is monitoring...</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
