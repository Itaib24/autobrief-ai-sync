import { useState, useCallback } from 'react';
import { AudioMetadata } from '@/types/audio';

export function useAudioMetadata() {
  const [isLoading, setIsLoading] = useState(false);

  const extractMetadata = useCallback(async (file: File): Promise<AudioMetadata> => {
    setIsLoading(true);
    
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(url);
        setIsLoading(false);
        reject(new Error('Metadata extraction timeout'));
      }, 5000); // 5 second timeout
      
      audio.addEventListener('loadedmetadata', () => {
        clearTimeout(timeout);
        
        const metadata: AudioMetadata = {
          duration: audio.duration || 0,
          format: file.type || getFormatFromName(file.name),
          size: file.size,
          bitrate: Math.round((file.size * 8) / (audio.duration || 1) / 1000), // Rough estimate
          sampleRate: 44100, // Default assumption
          channels: 2, // Default assumption
        };
        
        URL.revokeObjectURL(url);
        setIsLoading(false);
        resolve(metadata);
      });
      
      audio.addEventListener('error', () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        setIsLoading(false);
        reject(new Error('Failed to extract audio metadata'));
      });
      
      // Preload only metadata, not the entire file
      audio.preload = 'metadata';
      audio.src = url;
    });
  }, []);

  const formatDuration = useCallback((seconds: number): string => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }, []);

  return {
    extractMetadata,
    formatDuration,
    formatFileSize,
    isLoading
  };
}

function getFormatFromName(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  const formatMap: { [key: string]: string } = {
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'm4a': 'audio/mp4',
    'aac': 'audio/aac',
    'ogg': 'audio/ogg',
    'opus': 'audio/opus',
    'flac': 'audio/flac',
    'webm': 'audio/webm'
  };
  
  return formatMap[extension || ''] || 'audio/unknown';
}