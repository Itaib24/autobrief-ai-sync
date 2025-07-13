export interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
  duration?: number;
  result?: string;
}

export interface AudioData {
  file: File;
  url: string;
  duration: number;
  size: string;
}

export interface AudioFile {
  id: string;
  file: File;
  name: string;
  size: number;
  sizeFormatted: string;
  type: string;
  duration?: number;
  durationFormatted?: string;
  format?: string;
  url: string;
  waveform: number[];
  metadata: {
    duration: number;
    bitrate: number;
    sampleRate: number;
    channels: number;
    format: string;
  };
  quality?: {
    bitrate?: number;
    sampleRate?: number;
    channels?: number;
  };
  preview?: {
    url: string;
    waveform?: number[];
  };
  uploadProgress: number;
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'error';
  errorMessage?: string;
  error?: string;
}

export interface AudioUploadOptions {
  maxFiles: number;
  maxFileSize: number;
  maxDuration: number;
  supportedFormats: string[];
  enablePreview: boolean;
  enableWaveform: boolean;
}

export interface AudioMetadata {
  duration: number;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
  format: string;
  size: number;
}