import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AudioFile } from '@/types/audio';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  FileAudio,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface AudioFileCardProps {
  audioFile: AudioFile;
  onRemove: (id: string) => void;
  onPlay?: (id: string) => void;
  onPause?: (id: string) => void;
  isPlaying?: boolean;
}

export function AudioFileCard({ 
  audioFile, 
  onRemove, 
  onPlay, 
  onPause,
  isPlaying = false 
}: AudioFileCardProps) {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => setIsPlayerReady(true);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadError = () => setIsPlayerReady(false);

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleLoadError);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleLoadError);
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause?.(audioFile.id);
    } else {
      onPlay?.(audioFile.id);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !audioFile.duration) return;
    
    const seekTime = (parseFloat(e.target.value) / 100) * audioFile.duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const getStatusIcon = () => {
    switch (audioFile.uploadStatus) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileAudio className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const progressPercent = audioFile.duration ? (currentTime / audioFile.duration) * 100 : 0;

  return (
    <Card className="w-full glass animate-fade-in">
      <CardContent className="p-4">
        <audio
          ref={audioRef}
          src={audioFile.preview?.url}
          onPlay={() => onPlay?.(audioFile.id)}
          onPause={() => onPause?.(audioFile.id)}
          preload="metadata"
        />
        
        {/* Header with file info and remove button */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {getStatusIcon()}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate text-foreground">
                {audioFile.name}
              </h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span>{audioFile.sizeFormatted}</span>
                {audioFile.durationFormatted && (
                  <>
                    <span>•</span>
                    <span>{audioFile.durationFormatted}</span>
                  </>
                )}
                <span>•</span>
                <span className="uppercase">{audioFile.format.split('/')[1] || 'unknown'}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(audioFile.id)}
            className="text-muted-foreground hover:text-destructive p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Upload Progress */}
        {audioFile.uploadStatus === 'uploading' && (
          <div className="mb-3">
            <Progress value={audioFile.uploadProgress || 0} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Uploading... {audioFile.uploadProgress || 0}%
            </p>
          </div>
        )}

        {/* Error Message */}
        {audioFile.uploadStatus === 'error' && audioFile.errorMessage && (
          <div className="mb-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
            {audioFile.errorMessage}
          </div>
        )}

        {/* Audio Controls */}
        {audioFile.uploadStatus === 'completed' && audioFile.preview && (
          <div className="space-y-3">
            {/* Play Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPause}
                disabled={!isPlayerReady}
                className="h-8 w-8 p-0"
              >
                {isPlaying ? (
                  <Pause className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
              </Button>
              
              {/* Seek Bar */}
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercent}
                  onChange={handleSeek}
                  className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                  disabled={!isPlayerReady || !audioFile.duration}
                />
              </div>
              
              {/* Time Display */}
              <div className="text-xs text-muted-foreground min-w-0 flex-shrink-0">
                {Math.floor(currentTime / 60)}:{(Math.floor(currentTime) % 60).toString().padStart(2, '0')}
                {audioFile.durationFormatted && ` / ${audioFile.durationFormatted}`}
              </div>
            </div>

            {/* Volume Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="h-6 w-6 p-0"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-3 h-3" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
              </Button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Mini Waveform Placeholder */}
            {audioFile.preview.waveform && (
              <div className="h-8 bg-muted/30 rounded flex items-end justify-center gap-0.5 px-2">
                {audioFile.preview.waveform.slice(0, 50).map((amplitude, index) => (
                  <div
                    key={index}
                    className="bg-primary/60 w-0.5 rounded-t"
                    style={{ height: `${Math.max(2, amplitude * 24)}px` }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quality Information */}
        {audioFile.quality && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {audioFile.quality.bitrate && (
                <span>{Math.round(audioFile.quality.bitrate / 1000)}kbps</span>
              )}
              {audioFile.quality.sampleRate && (
                <span>{(audioFile.quality.sampleRate / 1000).toFixed(1)}kHz</span>
              )}
              {audioFile.quality.channels && (
                <span>{audioFile.quality.channels === 1 ? 'Mono' : 'Stereo'}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}