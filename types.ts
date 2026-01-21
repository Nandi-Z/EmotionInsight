
export enum SentimentType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL'
}

export interface Emotions {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
}

export interface SentimentAnalysisResult {
  id: string;
  text: string;
  sentiment: SentimentType;
  confidence: number;
  emotions: Emotions;
  explanation: string;
  entities: string[];
  timestamp: number;
}

export interface BatchAnalysisStatus {
  total: number;
  completed: number;
  isProcessing: boolean;
}
