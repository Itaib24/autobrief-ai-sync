import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { AudioData } from '@/types/audio';
import { 
  FileAudio, 
  Play, 
  CircleStop, 
  Volume2, 
  VolumeX,
  Clock,
  HardDrive,
  Radio,
  Music,
  BarChart3,
  SkipBack,
  SkipForward,
  RotateCcw,
  Zap,
  CheckCircle,
  Activity
} from 'lucide-react';

interface AudioPreviewProps {
  audioData: AudioData;
  isProcessing?: boolean;
}

export function AudioPreview({ audioData, isProcessing = false }: AudioPreviewProps) {
  const audioPlayer = useAudioPlayer();
  const [isHovered, setIsHovered] = useState(false);
  const [showWaveform, setShowWaveform] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Generate simple waveform visualization
  const generateWaveform = () => {
    return Array.from({ length: 50 }, () => Math.random() * 0.8 + 0.2);
  };

  const [waveformData] = useState(generateWaveform());

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Get audio quality indicator
  const getQualityIndicator = () => {
    const sizeMB = audioData.file.size / (1024 * 1024);
    if (sizeMB > 10) return { label: 'High', color: 'green' };
    if (sizeMB > 5) return { label: 'Good', color: 'blue' };
    return { label: 'Standard', color: 'orange' };
  };

  const quality = getQualityIndicator();

  useEffect(() => {
    if (audioPlayer.audioRef.current) {
      const audio = audioPlayer.audioRef.current;
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, [audioPlayer.audioRef]);

  return (
    <Card 
      className={`transition-all duration-300 hover:shadow-lg border-2 ${
        isProcessing ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20' : 'border-border hover:border-primary/50'
      } ${isHovered ? 'scale-[1.02]' : ''} animate-fade-in overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        isProcessing ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-shimmer"></div>
      </div>

      <CardContent className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            {/* Animated File Icon */}
            <div className={`p-3 rounded-xl bg-primary/10 transition-all duration-300 ${
              isProcessing ? 'animate-pulse' : isHovered ? 'scale-110 bg-primary/20' : ''
            }`}>
              <FileAudio className={`w-8 h-8 text-primary transition-all duration-300 ${
                isProcessing ? 'animate-pulse' : ''
              }`} />
            </div>
            
            {/* File Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-lg">
                <Music className="w-5 h-5 text-primary" />
                Audio Preview
                {isProcessing && (
                  <Badge variant="secondary" className="animate-pulse">
                    <Activity className="w-3 h-3 mr-1" />
                    Processing
                  </Badge>
                )}
              </h3>
              
              <p className="text-foreground font-medium truncate mb-1" title={audioData.file.name}>
                {audioData.file.name}
              </p>
              
              {/* File Metadata */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  {formatFileSize(audioData.file.size)}
                </span>
                {audioData.duration > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(audioData.duration)}
                  </span>
                )}
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    quality.color === 'green' ? 'border-green-200 text-green-700 bg-green-50' :
                    quality.color === 'blue' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                    'border-orange-200 text-orange-700 bg-orange-50'
                  }`}
                >
                  <Radio className="w-3 h-3 mr-1" />
                  {quality.label} Quality
                </Badge>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            {isProcessing ? (
              <div className="flex items-center gap-2 text-primary">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                <span className="text-sm font-medium">Ready for processing</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Ready</span>
              </div>
            )}
          </div>
        </div>

        {/* Waveform Visualization */}
        {showWaveform && (
          <div className="mb-6 p-4 bg-muted/30 rounded-xl border border-muted transition-all duration-300 hover:bg-muted/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Audio Waveform
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWaveform(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                Hide
              </Button>
            </div>
            
            <div className="relative h-16 bg-background rounded-lg p-2 overflow-hidden">
              <div className="flex items-end justify-between h-full gap-1">
                {waveformData.map((height, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-t from-primary to-primary/60 rounded-sm transition-all duration-300 ${
                      isProcessing ? 'animate-pulse' : ''
                    } hover:from-primary/80 hover:to-primary/40`}
                    style={{
                      height: `${height * 100}%`,
                      width: `${100 / waveformData.length}%`,
                      animationDelay: `${index * 50}ms`
                    }}
                  />
                ))}
              </div>
              
              {/* Progress Overlay */}
              {duration > 0 && (
                <div 
                  className="absolute top-0 left-0 h-full bg-primary/20 transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              )}
            </div>
          </div>
        )}

        {/* Audio Player Controls */}
        {audioData.url && (
          <div className="space-y-4">
            <audio
              ref={audioPlayer.audioRef}
              src={audioData.url}
              onTimeUpdate={audioPlayer.handleTimeUpdate}
              onLoadedMetadata={audioPlayer.handleLoadedMetadata}
              onEnded={() => audioPlayer.setIsPlaying(false)}
              className="hidden"
            />
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Progress 
                value={duration > 0 ? (currentTime / duration) * 100 : 0} 
                className="h-2 bg-muted cursor-pointer hover:h-3 transition-all duration-200"
                onClick={(e) => {
                  if (audioPlayer.audioRef.current && duration > 0) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percentage = clickX / rect.width;
                    audioPlayer.audioRef.current.currentTime = percentage * duration;
                  }
                }}
              />
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (audioPlayer.audioRef.current) {
                    audioPlayer.audioRef.current.currentTime = Math.max(0, currentTime - 10);
                  }
                }}
                className="hover:scale-105 transition-transform duration-200"
                disabled={isProcessing}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                variant="default"
                size="lg"
                onClick={audioPlayer.togglePlayback}
                className={`gap-2 hover:scale-105 transition-all duration-200 ${
                  audioPlayer.isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
                }`}
                disabled={isProcessing}
              >
                {audioPlayer.isPlaying ? (
                  <>
                    <CircleStop className="w-5 h-5" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Play
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (audioPlayer.audioRef.current) {
                    audioPlayer.audioRef.current.currentTime = Math.min(duration, currentTime + 10);
                  }
                }}
                className="hover:scale-105 transition-transform duration-200"
                disabled={isProcessing}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              
              <div className="w-px h-8 bg-border mx-2" />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={audioPlayer.toggleMute}
                className="hover:scale-105 transition-transform duration-200"
                disabled={isProcessing}
              >
                {audioPlayer.isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (audioPlayer.audioRef.current) {
                    audioPlayer.audioRef.current.currentTime = 0;
                  }
                }}
                className="hover:scale-105 transition-transform duration-200"
                disabled={isProcessing}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Processing Indicator */}
            {isProcessing && (
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-center gap-3">
                  <Zap className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">
                    Audio ready for AI processing...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {!showWaveform && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWaveform(true)}
              className="gap-2 hover:scale-105 transition-transform duration-200"
            >
              <BarChart3 className="w-4 h-4" />
              Show Waveform
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}