import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw } from 'lucide-react';
import { AudioData } from '@/types/audio';

interface WorkflowControlsProps {
  audioData: AudioData | null;
  isProcessing: boolean;
  hasResults: boolean;
  onStartProcessing: () => void;
  onReset: () => void;
}

export function WorkflowControls({ 
  audioData, 
  isProcessing, 
  hasResults, 
  onStartProcessing, 
  onReset 
}: WorkflowControlsProps) {
  if (!audioData) return null;

  return (
    <div className="flex justify-center gap-4 animate-fade-in">
      {!isProcessing && !hasResults && (
        <Button
          onClick={onStartProcessing}
          size="lg"
          className="gap-2 hover-scale px-8 py-4"
        >
          <Sparkles className="h-5 w-5" />
          Generate Professional Brief
        </Button>
      )}
      
      {hasResults && (
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="gap-2 hover-scale"
        >
          <RotateCcw className="h-5 w-5" />
          Process Another Audio
        </Button>
      )}
    </div>
  );
}