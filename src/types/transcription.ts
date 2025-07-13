export interface TranscriptionSegment {
  speaker: string;
  startTime: string;
  endTime: string;
  text: string;
  confidence: number;
  words?: TranscriptionWord[];
}

export interface TranscriptionWord {
  word: string;
  startTime: string;
  endTime: string;
  confidence: number;
}

export interface TranscriptionMetadata {
  duration: string;
  wordCount: number;
  speakerCount: number;
  averageConfidence: number;
  languageDetected: string;
  processingTime: number;
}

export interface TranscriptionResult {
  id: string;
  fullText: string;
  segments: TranscriptionSegment[];
  metadata: TranscriptionMetadata;
  qualityScore: number;
  warnings?: string[];
}

export interface TranscriptionOptions {
  enableSpeakerDiarization: boolean;
  enableProfanityFilter: boolean;
  languageCode: string;
  alternativeLanguageCodes: string[];
  enableWordTimeOffsets: boolean;
  enableAutomaticPunctuation: boolean;
  model: 'latest_long' | 'latest_short' | 'phone_call' | 'video' | 'default';
  useEnhanced: boolean;
  maxSpeakerCount?: number;
  minSpeakerCount?: number;
  enableSpeakerLabels?: boolean;
}

export interface ProcessingStatus {
  stage: 'uploading' | 'preprocessing' | 'transcribing' | 'analyzing' | 'finalizing' | 'completed' | 'error';
  progress: number;
  estimatedTimeRemaining?: number;
  currentOperation?: string;
  partialResults?: string;
}