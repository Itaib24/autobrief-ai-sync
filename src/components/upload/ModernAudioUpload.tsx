import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAudioMetadata } from '@/hooks/useAudioMetadata';
import { AudioFile, AudioUploadOptions } from '@/types/audio';
import { ModernFileCard } from './ModernFileCard';
import { RealTimeProgress } from './RealTimeProgress';
import { AudioWavePreview } from './AudioWavePreview';
import { 
  Upload, 
  CloudUpload, 
  Mic, 
  FileAudio,
  AlertCircle,
  CheckCircle,
  Zap,
  X,
  Play,
  Pause,
  Volume2,
  Sparkles,
  Music,
  BarChart3
} from 'lucide-react';

interface ModernAudioUploadProps {
  onFilesSelect: (files: AudioFile[]) => void;
  isProcessing?: boolean;
  options?: Partial<AudioUploadOptions>;
  existingFiles?: AudioFile[];
  enableRealTimeProgress?: boolean;
}

const DEFAULT_OPTIONS: AudioUploadOptions = {
  maxFiles: 10,
  maxFileSize: 100 * 1024 * 1024, // 100MB
  maxDuration: 3 * 60 * 60, // 3 hours
  supportedFormats: ['mp3', 'wav', 'm4a', 'ogg', 'opus', 'flac', 'aac', 'webm'],
  enablePreview: true,
  enableWaveform: false // Disabled by default for better performance
};

export function ModernAudioUpload({ 
  onFilesSelect, 
  isProcessing = false, 
  options = {},
  existingFiles = [],
  enableRealTimeProgress = true
}: ModernAudioUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { extractMetadata } = useAudioMetadata();

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  const [files, setFiles] = useState<AudioFile[]>(existingFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const generateFileId = () => {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const validateFile = (file: File): string[] => {
    const errors: string[] = [];
    
    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !mergedOptions.supportedFormats.includes(fileExtension)) {
      errors.push(`Unsupported format: ${fileExtension}. Supported: ${mergedOptions.supportedFormats.join(', ')}`);
    }
    
    // Check file size
    if (file.size > mergedOptions.maxFileSize) {
      errors.push(`File too large: ${formatFileSize(file.size)}. Max: ${formatFileSize(mergedOptions.maxFileSize)}`);
    }
    
    // Check if we have too many files
    if (files.length >= mergedOptions.maxFiles) {
      errors.push(`Maximum ${mergedOptions.maxFiles} files allowed`);
    }
    
    return errors;
  };

  const processFile = async (file: File): Promise<AudioFile> => {
    const fileId = generateFileId();
    
    // Create initial audio file object
    const audioFile: AudioFile = {
      id: fileId,
      file,
      name: file.name,
      size: file.size,
      sizeFormatted: formatFileSize(file.size),
      type: file.type,
      uploadStatus: 'uploading',
      uploadProgress: 0,
      url: URL.createObjectURL(file),
      waveform: [],
      metadata: {
        duration: 0,
        bitrate: 0,
        sampleRate: 0,
        channels: 0,
        format: file.name.split('.').pop()?.toLowerCase() || 'unknown'
      }
    };

    try {
      // Quick progress update
      audioFile.uploadProgress = 20;
      setFiles(prev => prev.map(f => f.id === fileId ? { ...audioFile } : f));

      // Extract metadata (this is fast)
      const metadata = await extractMetadata(file);
      audioFile.metadata = metadata;
      audioFile.duration = metadata.duration;
      audioFile.durationFormatted = formatDuration(metadata.duration);

      // Check duration limit
      if (metadata.duration > mergedOptions.maxDuration) {
        throw new Error(`Duration too long: ${formatDuration(metadata.duration)}. Max: ${formatDuration(mergedOptions.maxDuration)}`);
      }

      // Progress update after metadata
      audioFile.uploadProgress = 60;
      setFiles(prev => prev.map(f => f.id === fileId ? { ...audioFile } : f));

      // Generate waveform only for smaller files or if specifically enabled
      if (mergedOptions.enableWaveform && file.size < 50 * 1024 * 1024) { // Only for files < 50MB
        try {
          audioFile.uploadProgress = 80;
          setFiles(prev => prev.map(f => f.id === fileId ? { ...audioFile } : f));
          
          audioFile.waveform = await generateWaveform(file);
        } catch (error) {
          console.warn('Failed to generate waveform:', error);
          // Continue without waveform - create a simple placeholder
          audioFile.waveform = Array.from({ length: 100 }, () => Math.random() * 0.5 + 0.1);
        }
      } else {
        // For large files, create a simple placeholder waveform
        audioFile.waveform = Array.from({ length: 100 }, () => Math.random() * 0.5 + 0.1);
      }

      // Final progress update
      audioFile.uploadStatus = 'completed';
      audioFile.uploadProgress = 100;
      
      return audioFile;
    } catch (error) {
      audioFile.uploadStatus = 'error';
      audioFile.error = error instanceof Error ? error.message : 'Upload failed';
      throw error;
    }
  };

  const generateWaveform = async (file: File): Promise<number[]> => {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const reader = new FileReader();
      
      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        audioContext.close();
        reject(new Error('Waveform generation timeout'));
      }, 10000); // 10 second timeout
      
      reader.onload = async (e) => {
        try {
          clearTimeout(timeout);
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          // For large files, only process a portion to speed things up
          const maxSize = 5 * 1024 * 1024; // 5MB max for processing
          const processBuffer = arrayBuffer.byteLength > maxSize 
            ? arrayBuffer.slice(0, maxSize) 
            : arrayBuffer;
          
          const audioBuffer = await audioContext.decodeAudioData(processBuffer);
          
          const rawData = audioBuffer.getChannelData(0);
          const samples = 100; // Number of samples for waveform
          const blockSize = Math.floor(rawData.length / samples);
          const waveform: number[] = [];
          
          for (let i = 0; i < samples; i++) {
            let sum = 0;
            const startIdx = i * blockSize;
            const endIdx = Math.min(startIdx + blockSize, rawData.length);
            
            for (let j = startIdx; j < endIdx; j++) {
              sum += Math.abs(rawData[j]);
            }
            waveform.push(sum / (endIdx - startIdx));
          }
          
          // Normalize waveform
          const max = Math.max(...waveform);
          const normalized = max > 0 ? waveform.map(val => val / max) : waveform;
          
          resolve(normalized);
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        } finally {
          audioContext.close();
        }
      };
      
      reader.onerror = () => {
        clearTimeout(timeout);
        audioContext.close();
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const estimateBitrate = (file: File): number => {
    // Simple estimation based on file size and duration
    // This is approximate and may not be accurate for all formats
    return Math.round((file.size * 8) / 1000); // kbps estimate
  };

  const handleFileSelect = useCallback(async (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);
    setValidationErrors([]);
    
    // Validate all files first
    const allErrors: string[] = [];
    for (const file of fileArray) {
      const errors = validateFile(file);
      allErrors.push(...errors);
    }
    
    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      toast({
        title: "Upload Error",
        description: allErrors[0],
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const newFiles: AudioFile[] = [];

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setUploadProgress((i / fileArray.length) * 100);
        
        try {
          const audioFile = await processFile(file);
          newFiles.push(audioFile);
          setFiles(prev => [...prev, audioFile]);
        } catch (error) {
          console.error(`Failed to process file ${file.name}:`, error);
          toast({
            title: "Processing Error",
            description: `Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            variant: "destructive",
          });
        }
      }

      if (newFiles.length > 0) {
        onFilesSelect([...files, ...newFiles]);
        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${newFiles.length} file(s)`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [files, mergedOptions, onFilesSelect, toast, extractMetadata, enableRealTimeProgress]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesSelect(updatedFiles);
    
    // Revoke object URL to prevent memory leaks
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove?.url) {
      URL.revokeObjectURL(fileToRemove.url);
    }
  };

  const retryFile = async (fileId: string) => {
    const fileToRetry = files.find(f => f.id === fileId);
    if (!fileToRetry) return;

    try {
      const reprocessedFile = await processFile(fileToRetry.file);
      setFiles(prev => prev.map(f => f.id === fileId ? reprocessedFile : f));
      onFilesSelect(files.map(f => f.id === fileId ? reprocessedFile : f));
      
      toast({
        title: "Retry Successful",
        description: `${fileToRetry.name} processed successfully`,
      });
    } catch (error) {
      toast({
        title: "Retry Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, []);

  const hasValidFiles = files.some(f => f.uploadStatus === 'completed');
  const hasErrors = files.some(f => f.uploadStatus === 'error');

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card className={`border-2 border-dashed transition-all duration-300 ${
        isDragOver 
          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' 
          : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50'
      } ${isProcessing ? 'opacity-50 pointer-events-none' : 'hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/70'}`}>
        <CardContent 
          ref={dropZoneRef}
          className="p-8 text-center cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={mergedOptions.maxFiles > 1}
            accept={mergedOptions.supportedFormats.map(format => `.${format}`).join(',')}
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            className="hidden"
            disabled={isProcessing}
          />

          <div className="space-y-4">
            <div className="flex justify-center">
              <div className={`p-4 rounded-full transition-all duration-300 ${
                isDragOver 
                  ? 'bg-blue-100 dark:bg-blue-950/30' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <CloudUpload className={`w-12 h-12 transition-colors duration-300 ${
                  isDragOver 
                    ? 'text-blue-600' 
                    : 'text-gray-400 dark:text-gray-500'
                }`} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {isDragOver ? 'Drop your audio files here' : 'Upload Audio Files'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag and drop your files here, or click to browse
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Supported formats: {mergedOptions.supportedFormats.join(', ').toUpperCase()}</span>
              <span>•</span>
              <span>Max size: {formatFileSize(mergedOptions.maxFileSize)}</span>
              <span>•</span>
              <span>Max duration: {formatDuration(mergedOptions.maxDuration)}</span>
            </div>

            <Button 
              variant="outline" 
              className="mt-4"
              disabled={isProcessing}
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-200">Upload Errors</h4>
                <ul className="text-sm text-red-700 dark:text-red-300 mt-1 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Uploading files...
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Uploaded Files ({files.length})
          </h3>
          <div className="space-y-3">
            {files.map((file) => (
              <ModernFileCard
                key={file.id}
                file={file}
                onRemove={() => removeFile(file.id)}
                onRetry={() => retryFile(file.id)}
                showWaveform={mergedOptions.enableWaveform}
                showPreview={mergedOptions.enablePreview}
              />
            ))}
          </div>
        </div>
      )}

      {/* Success State */}
      {hasValidFiles && !isUploading && (
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200">
                  Files Ready
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {files.filter(f => f.uploadStatus === 'completed').length} file(s) successfully uploaded and ready for processing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}