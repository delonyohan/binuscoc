export enum ViolationType {
  SHORTS = 'Shorts',
  SANDALS = 'Sandals',
  SLEEVELESS = 'Sleeveless',
  NONE = 'None'
}

export interface Detection {
  id: string;
  timestamp: number;
  type: ViolationType;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  imageSnapshot?: string; // Base64
}

export interface DailyStat {
  date: string;
  shorts: number;
  sandals: number;
  sleeveless: number;
  total: number;
}

export interface ModelStatus {
  version: string;
  status: 'IDLE' | 'TRAINING' | 'SERVING';
  lastTrained: string;
  accuracy: number; // mAP
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  isThinking?: boolean;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
}


