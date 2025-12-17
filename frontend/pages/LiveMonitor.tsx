import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Detection, ViolationType } from '../types';
import { Card } from '../components/ui/card';

export const LiveMonitor: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start Camera
  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
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
    } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions and ensure your camera is not in use by another application.");
        setIsLoading(false);
    }
  };

  const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
      }
      setIsStreamActive(false);
      setDetections([]);
      setError(null);
  };

  // Send video frames to backend for prediction
  useEffect(() => {
    let interval: number;

    if (isStreamActive) {
        const video = videoRef.current;
        const captureCanvas = document.createElement('canvas');
        const ctx = captureCanvas.getContext('2d');

        if (video && ctx) {
            captureCanvas.width = video.videoWidth;
            captureCanvas.height = video.videoHeight;

            interval = window.setInterval(async () => {
                if (isPredicting || !video) return;

                setIsPredicting(true);
                setError(null);
                try {
                    ctx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
                    const imageData = captureCanvas.toDataURL('image/jpeg', 0.8);
                    
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/predict`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: imageData }),
                    });

                    if (!response.ok) throw new Error('Prediction request failed');

                    const data = await response.json();

                    if (data.detections && data.detections.length > 0) {
                        const newDetections = data.detections.map((det: Detection) => ({
                            ...det,
                            imageSnapshot: captureCanvas.toDataURL('image/jpeg', 0.5)
                        }));
                        // Add new detections to the top, keep a max of 10
                        setDetections(prev => [...newDetections, ...prev].slice(0, 10));
                    } else {
                        // Clear old detections if no new ones are found
                        if(detections.length > 0) setDetections([]);
                    }
                } catch (error) {
                    console.error("Error during prediction:", error);
                    setError("Connection to server lost. Please check the backend.");
                } finally {
                    setIsPredicting(false);
                }
            }, 500); // Send a frame every 500ms (2 FPS)
        }
    }

    return () => clearInterval(interval);
  }, [isStreamActive, isPredicting, detections]);

  // Draw Bounding Boxes
  const drawDetections = useCallback(() => {
      if (!canvasRef.current || !videoRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      const videoAspectRatio = video.videoWidth / video.videoHeight;
      const canvasAspectRatio = canvas.clientWidth / canvas.clientHeight;
      let scale = 1;
      let offsetX = 0;
      let offsetY = 0;

      if (videoAspectRatio > canvasAspectRatio) {
          scale = canvas.clientWidth / video.videoWidth;
          offsetY = (canvas.clientHeight - video.videoHeight * scale) / 2;
      } else {
          scale = canvas.clientHeight / video.videoHeight;
          offsetX = (canvas.clientWidth - video.videoWidth * scale) / 2;
      }
      
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const violationColors: Record<string, string> = {
          'Shorts': '#facc15', 
          'Sandals': '#f97316',
          'Sleeveless': '#ef4444',
      };

      detections.forEach(det => {
          const { x, y, width, height } = det.boundingBox;
          const scaledX = x * scale + offsetX;
          const scaledY = y * scale + offsetY;
          const scaledWidth = width * scale;
          const scaledHeight = height * scale;
          const color = violationColors[det.type] || '#a855f7';

          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

          const label = `${det.type} (${(det.confidence * 100).toFixed(0)}%)`;
          ctx.font = 'bold 14px Inter';
          const textMetrics = ctx.measureText(label);
          ctx.fillStyle = color;
          ctx.fillRect(scaledX, scaledY - 20, textMetrics.width + 10, 20);
          ctx.fillStyle = 'white';
          ctx.fillText(label, scaledX + 5, scaledY - 5);
      });
  }, [detections]);

  useEffect(() => {
      let animationFrameId: number;
      const render = () => {
          drawDetections();
          animationFrameId = requestAnimationFrame(render);
      };
      if (isStreamActive) render();
      return () => cancelAnimationFrame(animationFrameId);
  }, [isStreamActive, drawDetections]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Live Monitoring</h1>
            <p className="text-slate-500 mt-1">Real-time dress code analysis from connected camera.</p>
          </div>
          <button 
              onClick={isStreamActive ? stopCamera : startCamera}
              className={`px-6 py-2 rounded-lg font-semibold text-white transition-all w-40 h-10 flex items-center justify-center ${
                  isStreamActive 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
              disabled={isLoading}
          >
              {isLoading ? <i className="fas fa-spinner fa-spin"></i> : (isStreamActive ? 'Stop Stream' : 'Start Camera')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative bg-black rounded-xl overflow-hidden shadow-lg aspect-video flex items-center justify-center text-white">
              {error && (
                <div className="absolute inset-0 bg-black bg-opacity-70 z-20 flex flex-col items-center justify-center p-4">
                  <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                  <h3 className="font-semibold text-lg mb-2">An Error Occurred</h3>
                  <p className="text-center text-slate-300">{error}</p>
                </div>
              )}
              {!isStreamActive && !isLoading && !error && (
                  <div className="text-slate-500 flex flex-col items-center">
                      <i className="fas fa-video-slash text-5xl mb-4"></i>
                      <span className="font-medium">Camera is Offline</span>
                  </div>
              )}
              <video 
                  ref={videoRef} 
                  className={`w-full h-full object-contain transition-opacity duration-300 ${isStreamActive ? 'opacity-100' : 'opacity-0'}`}
                  muted
                  playsInline
              />
              <canvas 
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
              />
              
              {isStreamActive && (
                  <div className={`absolute top-4 right-4 text-white text-xs font-bold px-2 py-1 rounded transition-all ${isPredicting ? 'bg-blue-600 animate-pulse' : 'bg-red-600'}`}>
                      {isPredicting ? 'ANALYZING...' : 'LIVE'}
                  </div>
              )}
          </div>

          <Card className="flex flex-col h-[40rem] lg:h-auto">
              <CardHeader className="flex-shrink-0">
                  <CardTitle>Recent Violations</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                  {detections.length > 0 ? (
                      detections.map((det) => (
                          <div key={det.id} className="flex gap-4 items-center p-3 bg-red-50/50 border border-red-100 rounded-lg animate-fade-in">
                              <img src={det.imageSnapshot} alt="snapshot" className="w-20 h-20 rounded-md object-cover bg-slate-200" />
                              <div>
                                  <p className="font-bold text-red-800">{det.type}</p>
                                  <p className="text-sm text-slate-600">Confidence: <strong>{(det.confidence * 100).toFixed(1)}%</strong></p>
                                  <p className="text-xs text-slate-400 mt-1">{new Date(det.timestamp).toLocaleTimeString()}</p>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="text-center text-slate-400 h-full flex flex-col justify-center items-center">
                          <i className="fas fa-shield-alt text-5xl mb-4"></i>
                          <p className="font-medium">No violations detected.</p>
                          <p className="text-xs mt-1">System is actively monitoring.</p>
                      </div>
                  )}
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
