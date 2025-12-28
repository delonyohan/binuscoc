import * as ort from 'onnxruntime-web';

export async function preprocess(ctx: CanvasRenderingContext2D, width: number, height: number): Promise<ort.Tensor> {
    const targetDim = 640;
    
    const offscreen = new OffscreenCanvas(targetDim, targetDim);
    const offCtx = offscreen.getContext('2d');
    if(!offCtx) throw new Error("Could not create offscreen context");
    
    // Draw and resize
    offCtx.drawImage(ctx.canvas, 0, 0, width, height, 0, 0, targetDim, targetDim);
    const imageData = offCtx.getImageData(0, 0, targetDim, targetDim);
    const { data } = imageData;

    const float32Data = new Float32Array(3 * targetDim * targetDim);
    
    // Convert to float32 (0-1) and CHW
    for (let i = 0; i < targetDim * targetDim; i++) {
        float32Data[i] = data[i * 4] / 255.0; // R
        float32Data[targetDim * targetDim + i] = data[i * 4 + 1] / 255.0; // G
        float32Data[2 * targetDim * targetDim + i] = data[i * 4 + 2] / 255.0; // B
    }

    return new ort.Tensor('float32', float32Data, [1, 3, targetDim, targetDim]);
}

export function postprocess(results: any, width: number, height: number, classes: string[]) {
    // Determine output shape dynamically
    const key = Object.keys(results)[0];
    const tensor = results[key];
    const output = tensor.data;
    const dims = tensor.dims; 
    
    let rows, cols, isTransposed;

    // Check if [1, Anchors, Channels] or [1, Channels, Anchors]
    // We assume 'Channels' is small (e.g. 12 = 5 + 7 classes)
    // and 'Anchors' is large (e.g. 25200 or 8400)
    
    if (dims[1] > dims[2]) {
        // Standard: [1, 25200, 12]
        rows = dims[1]; // Anchors
        cols = dims[2]; // Channels
        isTransposed = false;
    } else {
        // Transposed: [1, 12, 25200]
        rows = dims[2]; // Anchors
        cols = dims[1]; // Channels
        isTransposed = true;
    }

    const detections: any[] = [];
    const confThreshold = 0.45; 

    // Helper to access data based on layout
    const get = (anchorIdx: number, channelIdx: number) => {
        if (isTransposed) {
            // [1, Channels, Anchors] -> Flattened: Channel 0 (all anchors), Channel 1...
            // index = channelIdx * rows + anchorIdx
            return output[channelIdx * rows + anchorIdx];
        } else {
            // [1, Anchors, Channels] -> Flattened: Anchor 0 (all channels), Anchor 1...
            // index = anchorIdx * cols + channelIdx
            return output[anchorIdx * cols + channelIdx];
        }
    };

    for (let i = 0; i < rows; i++) {
        // Check "Objectness" confidence (usually index 4 in YOLOv5)
        // Note: YOLOv8 sometimes omits obj_conf and goes straight to class_conf. 
        // If cols == 4 + classes (e.g. 11), it's likely v8 style (no obj conf).
        // If cols == 5 + classes (e.g. 12), it's v5 style.
        
        let confidence = 0;
        let classOffset = 0;

        if (cols === 4 + classes.length) {
             // v8 style: [x, y, w, h, class0, class1...]
             // Confidence is max(class_probs)
             classOffset = 4;
             confidence = 1.0; // Implicit objectness
        } else {
             // v5 style: [x, y, w, h, obj, class0...]
             classOffset = 5;
             confidence = get(i, 4);
        }

        // Clamp confidence to 0-1 (fix for potential large logits if no sigmoid)
        // Although usually export includes sigmoid. If we see > 1, assume simple coordinate mixup fixed by 'get'
        // or apply simple clamp.
        if (confidence > 1) confidence = 1; // Safety clamp
        
        if (confidence > confThreshold) {
            let maxClassProb = 0;
            let classIndex = 0;
            
            for (let c = 0; c < classes.length; c++) {
                let prob = get(i, classOffset + c);
                if(prob > 1) prob = 1; // Safety clamp
                
                if (prob > maxClassProb) {
                    maxClassProb = prob;
                    classIndex = c;
                }
            }
            
            const score = confidence * maxClassProb;
            
            if (score > confThreshold) {
                const cx = get(i, 0);
                const cy = get(i, 1);
                const w = get(i, 2);
                const h = get(i, 3);
                
                const scaleX = width / 640;
                const scaleY = height / 640;
                
                const x = (cx - w / 2) * scaleX;
                const y = (cy - h / 2) * scaleY;
                const boxW = w * scaleX;
                const boxH = h * scaleY;
                
                detections.push({
                    label: classes[classIndex],
                    confidence: score,
                    box: [x, y, boxW, boxH]
                });
            }
        }
    }
    
    return nms(detections);
}

function nms(detections: any[], iouThreshold = 0.5) {
    if (detections.length === 0) return [];
    
    detections.sort((a, b) => b.confidence - a.confidence);
    
    const selected = [];
    const active = new Array(detections.length).fill(true);
    
    for (let i = 0; i < detections.length; i++) {
        if (active[i]) {
            selected.push(detections[i]);
            
            for (let j = i + 1; j < detections.length; j++) {
                if (active[j]) {
                    const iou = calculateIoU(detections[i].box, detections[j].box);
                    if (iou > iouThreshold) {
                        active[j] = false;
                    }
                }
            }
        }
    }
    return selected;
}

function calculateIoU(boxA: number[], boxB: number[]) {
    const x1 = Math.max(boxA[0], boxB[0]);
    const y1 = Math.max(boxA[1], boxB[1]);
    const x2 = Math.min(boxA[0] + boxA[2], boxB[0] + boxB[2]);
    const y2 = Math.min(boxA[1] + boxA[3], boxB[1] + boxB[3]);
    
    const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    const areaA = boxA[2] * boxA[3];
    const areaB = boxB[2] * boxB[3];
    
    return intersection / (areaA + areaB - intersection);
}