import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AudioFile } from '@/types/audio';
import { AudioWavePreview } from './AudioWavePreview';
import { 
  Play, 
  Pause, 
  X, 
  FileAudio, 
  Clock,
  HardDrive,
  Radio,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface ModernFileCardProps {
  audioFile: AudioFile;
  onRemove: (fileId: string) => void;
  onPlay: (fileId: string) => void;
  onPause: () => void;
  isPlaying: boolean;
  uploadProgress?: number;
  processingState?: string;
  index: number;
}

export function ModernFileCard({
  audioFile,
  onRemove,
  onPlay,
  onPause,
  isPlaying,
  uploadProgress,
  processingState,
  index
}: ModernFileCardProps) {
  const isCompleted = audioFile.uploadStatus === 'completed';
  const isError = audioFile.uploadStatus === 'error';
  const isProcessing = uploadProgress !== undefined && uploadProgress < 100;

  const getStatusIcon = () => {
    if (isError) return <AlertCircle className="w-4 h-4 text-destructive" />;
    if (isProcessing) return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
    if (isCompleted) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <FileAudio className="w-4 h-4 text-muted-foreground" />;
  };

  const getStatusColor = () => {
    if (isError) return 'border-destructive bg-destructive/5';
    if (isProcessing) return 'border-primary bg-primary/5';
    if (isCompleted) return 'border-green-200 bg-green-50/50';
    return 'border-border bg-background';
  };

  return (
    <Card 
      className={`transition-all duration-300 hover:shadow-lg ${getStatusColor()} animate-fade-in`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* File Icon */}
              <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                {getStatusIcon()}
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-foreground truncate" title={audioFile.name}>
                  {audioFile.name}
                </h5>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    {audioFile.sizeFormatted}
                  </span>
                  {audioFile.durationFormatted && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {audioFile.durationFormatted}
                    </span>
                  )}
                  {audioFile.quality?.bitrate && (
                    <span className="flex items-center gap-1">
                      <Radio className="w-3 h-3" />
                      {audioFile.quality.bitrate}k
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {isCompleted && audioFile.preview?.url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => isPlaying ? onPause() : onPlay(audioFile.id)}
                  className="hover-scale"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(audioFile.id)}
                className="text-muted-foreground hover:text-destructive hover-scale"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Processing Progress */}
          {isProcessing && uploadProgress !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {processingState || 'Processing...'}
                </span>
                <span className="font-medium text-primary">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <Progress 
                value={uploadProgress} 
                className="h-2 bg-muted"
              />
            </div>
          )}

          {/* Error Message */}
          {isError && audioFile.errorMessage && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                {audioFile.errorMessage}
              </p>
            </div>
          )}

          {/* Audio Waveform Preview */}
          {isCompleted && audioFile.preview?.waveform && (
            <AudioWavePreview 
              waveform={audioFile.preview.waveform}
              isPlaying={isPlaying}
              duration={audioFile.duration}
            />
          )}

          {/* Quality Information */}
          {isCompleted && audioFile.quality && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
              <span>Quality: High</span>
              {audioFile.quality.sampleRate && (
                <span>{audioFile.quality.sampleRate}Hz</span>
              )}
              {audioFile.quality.channels && (
                <span>{audioFile.quality.channels === 1 ? 'Mono' : 'Stereo'}</span>
              )}
              <span>{audioFile.format.split('/')[1]?.toUpperCase()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}