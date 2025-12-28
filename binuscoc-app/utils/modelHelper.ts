import * as ort from 'onnxruntime-web';

export async function preprocess(ctx: CanvasRenderingContext2D, width: number, height: number): Promise<ort.Tensor> {
    const targetDim = 640;
    
    const offscreen = new OffscreenCanvas(targetDim, targetDim);
    const offCtx = offscreen.getContext('2d');
    if(!offCtx) throw new Error("Could not create offscreen context");
    
    offCtx.drawImage(ctx.canvas, 0, 0, width, height, 0, 0, targetDim, targetDim);
    const imageData = offCtx.getImageData(0, 0, targetDim, targetDim);
    const { data } = imageData;

    const float32Data = new Float32Array(3 * targetDim * targetDim);
    
    for (let i = 0; i < targetDim * targetDim; i++) {
        float32Data[i] = data[i * 4] / 255.0; // R
        float32Data[targetDim * targetDim + i] = data[i * 4 + 1] / 255.0; // G
        float32Data[2 * targetDim * targetDim + i] = data[i * 4 + 2] / 255.0; // B
    }

    return new ort.Tensor('float32', float32Data, [1, 3, targetDim, targetDim]);
}

export function postprocess(results: any, width: number, height: number, classes: string[]) {
    const key = Object.keys(results)[0];
    const tensor = results[key];
    const output = tensor.data;
    const dims = tensor.dims; 
    
    let rows, cols, isTransposed;
    
    if (dims[1] > dims[2]) {
        rows = dims[1];
        cols = dims[2];
        isTransposed = false;
    } else {
        rows = dims[2];
        cols = dims[1];
        isTransposed = true;
    }

    const boxes: any[] = [];
    const objThreshold = 0.25;
    const classThreshold = 0.20;

    const get = (anchorIdx: number, channelIdx: number) => {
        return isTransposed 
            ? output[channelIdx * rows + anchorIdx]
            : output[anchorIdx * cols + channelIdx];
    };

    for (let i = 0; i < rows; i++) {
        const objectness = get(i, 4);
        if (objectness < objThreshold) {
            continue;
        }

        const classProbs = [];
        for (let c = 0; c < classes.length; c++) {
            classProbs.push(get(i, 5 + c));
        }

        for (let j = 0; j < classProbs.length; j++) {
            const classProb = classProbs[j];
            const score = objectness * classProb;

            if (score > classThreshold) {
                const cx = get(i, 0);
                const cy = get(i, 1);
                const w = get(i, 2);
                const h = get(i, 3);
                
                const scaleX = width / 640;
                const scaleY = height / 640;
                
                const x = (cx - w / 2) * scaleX;
                const y = (cy - h / 2) * scaleY;
                
                boxes.push({
                    classIndex: j,
                    label: classes[j],
                    confidence: score,
                    box: [x, y, w * scaleX, h * scaleY]
                });
            }
        }
    }
    
    return nmsByClass(boxes);
}

function nmsByClass(boxes: any[], iouThreshold = 0.45) {
    const result: any[] = [];
    const classes = new Map<number, any[]>();
    
    // Group boxes by class
    for (const box of boxes) {
        if (!classes.has(box.classIndex)) {
            classes.set(box.classIndex, []);
        }
        classes.get(box.classIndex)!.push(box);
    }
    
    // Run NMS for each class
    for (const [_, classBoxes] of classes) {
        classBoxes.sort((a, b) => b.confidence - a.confidence);
        
        const active = new Array(classBoxes.length).fill(true);
        for (let i = 0; i < classBoxes.length; i++) {
            if (active[i]) {
                result.push(classBoxes[i]);
                for (let j = i + 1; j < classBoxes.length; j++) {
                    if (active[j]) {
                        const iou = calculateIoU(classBoxes[i].box, classBoxes[j].box);
                        if (iou > iouThreshold) {
                            active[j] = false;
                        }
                    }
                }
            }
        }
    }
    
    return result;
}

function calculateIoU(boxA: number[], boxB: number[]) {
    const x1 = Math.max(boxA[0], boxB[0]);
    const y1 = Math.max(boxA[1], boxB[1]);
    const x2 = Math.min(boxA[0] + boxA[2], boxB[0] + boxB[2]);
    const y2 = Math.min(boxA[1] + boxA[3], boxB[1] + boxB[3]);
    
    const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    const areaA = boxA[2] * boxA[3];
    const areaB = boxB[2] * boxB[3];
    
    const iou = intersection / (areaA + areaB - intersection);
    return isNaN(iou) ? 0 : iou;
}