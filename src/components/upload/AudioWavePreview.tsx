import React, { useRef, useEffect, useState } from 'react';

interface AudioWavePreviewProps {
  waveform: number[];
  isPlaying?: boolean;
  duration?: number;
  currentTime?: number;
  className?: string;
}

export function AudioWavePreview({ 
  waveform, 
  isPlaying = false, 
  duration = 0,
  currentTime = 0,
  className = "" 
}: AudioWavePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveform.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSize;
    if (width === 0 || height === 0) return;

    // Set canvas size for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate progress
    const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;
    const progressIndex = Math.floor(progress * waveform.length);

    // Draw waveform
    const barWidth = width / waveform.length;
    const centerY = height / 2;
    const maxBarHeight = height * 0.8;

    waveform.forEach((amplitude, index) => {
      const x = index * barWidth;
      const barHeight = amplitude * maxBarHeight;
      const y = centerY - barHeight / 2;

      // Determine bar color based on playback progress
      const isPlayed = index <= progressIndex;
      const alpha = isPlaying && isPlayed ? 1 : 0.6;
      
      // Create gradient for each bar
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      
      if (isPlaying && isPlayed) {
        // Played portion - primary color
        gradient.addColorStop(0, `hsla(var(--primary), ${alpha})`);
        gradient.addColorStop(1, `hsla(var(--primary), ${alpha * 0.6})`);
      } else {
        // Unplayed portion - muted color
        gradient.addColorStop(0, `hsla(var(--muted-foreground), ${alpha})`);
        gradient.addColorStop(1, `hsla(var(--muted-foreground), ${alpha * 0.4})`);
      }

      ctx.fillStyle = gradient;
      
      // Add subtle border radius effect
      ctx.beginPath();
      ctx.roundRect(x + barWidth * 0.1, y, barWidth * 0.8, barHeight, barWidth * 0.4);
      ctx.fill();

      // Add glow effect for playing bar
      if (isPlaying && index === progressIndex) {
        ctx.shadowColor = `hsl(var(--primary))`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Draw progress line
    if (isPlaying && progress > 0) {
      const progressX = progress * width;
      ctx.strokeStyle = `hsl(var(--primary))`;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, height);
      ctx.stroke();

      // Add glow to progress line
      ctx.shadowColor = `hsl(var(--primary))`;
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

  }, [waveform, isPlaying, currentTime, duration, canvasSize]);

  if (!waveform.length) {
    return (
      <div className={`h-12 bg-muted/30 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-xs text-muted-foreground">No waveform data</span>
      </div>
    );
  }

  return (
    <div className={`relative h-12 bg-muted/10 rounded-lg overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Overlay gradient for modern effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
      
      {/* Playing indicator */}
      {isPlaying && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
}