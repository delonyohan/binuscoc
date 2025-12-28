"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, Zap, Activity, Image as ImageIcon } from 'lucide-react';
import * as ort from 'onnxruntime-web';
import { preprocess, postprocess } from '@/utils/modelHelper';

ort.env.wasm.wasmPaths = "/"; 
ort.env.logLevel = 'error'; 

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

export default function StaticImageDetector() {
  const [image, setImage] = useState<{ url: string; file: File } | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detections, setDetections] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const sessionRef = useRef<ort.InferenceSession | null>(null);

  useEffect(() => {
    const loadModel = async () => {
        try {
            const session = await ort.InferenceSession.create('/yolov5s.onnx', { executionProviders: ['wasm'] });
            sessionRef.current = session;
            setIsModelLoaded(true);
        } catch (e) {
            console.error("Failed to load model:", e);
        }
    };
    loadModel();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert("Invalid file type. Please use JPG or PNG.");
      return;
    }
    
    setDetections([]);
    if(canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx?.clearRect(0,0, canvasRef.current.width, canvasRef.current.height);
    }

    const url = URL.createObjectURL(file);
    setImage({ url, file });
  };

  const handleDetection = async () => {
    if (!imageRef.current || !canvasRef.current || !sessionRef.current) return;

    setIsProcessing(true);
    setDetections([]);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    try {
        const tensor = await preprocess(ctx, img.naturalWidth, img.naturalHeight);
        const feeds: Record<string, ort.Tensor> = { [sessionRef.current.inputNames[0]]: tensor };
        const results = await sessionRef.current.run(feeds);
        const processedDetections = postprocess(results, img.naturalWidth, img.naturalHeight, CLASSES);
        setDetections(processedDetections);

        processedDetections.forEach((det: any) => {
            const [x, y, w, h] = det.box;
            const isViolation = det.label in VIOLATION_RULES;
            
            ctx.strokeStyle = isViolation ? '#ef4444' : '#22c55e';
            ctx.lineWidth = Math.max(2, img.naturalWidth / 300); // Scale line width
            ctx.strokeRect(x, y, w, h);

            const text = `${det.label} ${(det.confidence * 100).toFixed(1)}%`;
            const fontSize = Math.max(14, img.naturalWidth / 50);
            ctx.font = `bold ${fontSize}px Arial`;
            const textWidth = ctx.measureText(text).width;
            
            ctx.fillStyle = isViolation ? '#ef4444' : '#22c55e';
            ctx.fillRect(x, y - (fontSize + 8), textWidth + 8, fontSize + 8);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(text, x + 4, y - 6);
        });
    } catch(e) {
        console.error("Error during detection:", e);
        alert("An error occurred during detection.");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-800">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Test Model on Image</h3>
      
      {!image ? (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <ImageIcon className="mx-auto h-12 w-12" />
            <p className="mt-2 text-sm"><span className="font-semibold">Click to upload</span></p>
            <p className="text-xs">PNG or JPG (MAX. 10MB)</p>
          </div>
          <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="relative w-full border rounded-lg overflow-hidden">
            <img ref={imageRef} src={image.url} alt="Uploaded preview" className="w-full h-auto" />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
            <button 
              onClick={() => {setImage(null); setDetections([])}}
              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/80 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleDetection}
            disabled={!isModelLoaded || isProcessing}
            className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isProcessing ? <Activity className="w-5 h-5 mr-2 animate-spin"/> : <Zap className="w-5 h-5 mr-2"/>}
            {isProcessing ? 'Detecting...' : (isModelLoaded ? 'Run Detection' : 'Loading Model...')}
          </button>
        </div>
      )}

      {detections.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Detection Results:</h4>
          <ul className="space-y-2 text-sm">
            {detections.map((d, i) => (
              <li key={i} className={`p-3 rounded-md ${d.label in VIOLATION_RULES ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'} border ${d.label in VIOLATION_RULES ? 'border-red-100' : 'border-green-100'}`}>
                <span className="font-bold capitalize">{d.label.replace('_', ' ')}</span> - Confidence: <span className="font-mono">{(d.confidence * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}