import { useState, useRef, useEffect, useCallback } from 'react';
import { ProcessingStep, AudioData } from '@/types/audio';
import { PROCESSING_STEPS } from '@/constants/templates';

interface WorkflowMetrics {
  processingSpeed: number;
  qualityScore: number;
  confidenceLevel: number;
  estimatedTimeRemaining: number;
}

interface EnhancedProcessingStep extends ProcessingStep {
  startTime?: number;
  endTime?: number;
  duration?: number;
  retryCount?: number;
  metrics?: Partial<WorkflowMetrics>;
}

export function useEnhancedWorkflowState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [generatedBrief, setGeneratedBrief] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [steps, setSteps] = useState<EnhancedProcessingStep[]>(
    PROCESSING_STEPS.map(step => ({ ...step, retryCount: 0 }))
  );
  const [briefId, setBriefId] = useState<string | null>(null);
  const [processingDetails, setProcessingDetails] = useState<string>('');
  const [requestId, setRequestId] = useState<string>('');
  const [workflowMetrics, setWorkflowMetrics] = useState<WorkflowMetrics>({
    processingSpeed: 0,
    qualityScore: 0,
    confidenceLevel: 0,
    estimatedTimeRemaining: 0
  });
  const [errorHistory, setErrorHistory] = useState<Array<{
    stepIndex: number;
    error: string;
    timestamp: number;
    retryAttempt: number;
  }>>([]);

  const workflowStartTime = useRef<number | null>(null);
  const stepTimers = useRef<Map<number, number>>(new Map());

  // Start workflow timing
  const startWorkflow = useCallback(() => {
    workflowStartTime.current = Date.now();
    setIsProcessing(true);
    setErrorHistory([]);
  }, []);

  // Update step with enhanced tracking
  const updateStepStatus = useCallback((
    stepIndex: number, 
    status: ProcessingStep['status'], 
    details?: string,
    metrics?: Partial<WorkflowMetrics>
  ) => {
    const now = Date.now();
    
    setSteps(prev => prev.map((step, idx) => {
      if (idx === stepIndex) {
        const updatedStep: EnhancedProcessingStep = { ...step, status };
        
        // Track timing
        if (status === 'processing' && !stepTimers.current.has(idx)) {
          stepTimers.current.set(idx, now);
          updatedStep.startTime = now;
        } else if (status === 'completed' || status === 'error') {
          const startTime = stepTimers.current.get(idx);
          if (startTime) {
            updatedStep.endTime = now;
            updatedStep.duration = now - startTime;
            stepTimers.current.delete(idx);
          }
        }
        
        // Add metrics
        if (metrics) {
          updatedStep.metrics = { ...updatedStep.metrics, ...metrics };
        }
        
        return updatedStep;
      }
      return step;
    }));

    // Update processing details
    if (details) {
      setProcessingDetails(details);
    }

    // Update workflow metrics
    if (metrics) {
      setWorkflowMetrics(prev => ({ ...prev, ...metrics }));
    }

    // Log errors
    if (status === 'error') {
      setErrorHistory(prev => [...prev, {
        stepIndex,
        error: details || 'Unknown error',
        timestamp: now,
        retryAttempt: steps[stepIndex]?.retryCount || 0
      }]);
    }
  }, [steps]);

  // Retry step with enhanced tracking
  const retryStep = useCallback((stepIndex: number) => {
    setSteps(prev => prev.map((step, idx) => {
      if (idx === stepIndex) {
        return {
          ...step,
          status: 'pending' as const,
          retryCount: (step.retryCount || 0) + 1,
          metrics: undefined,
          startTime: undefined,
          endTime: undefined,
          duration: undefined
        };
      }
      return step;
    }));

    // Reset progress to retry point
    setCurrentStep(stepIndex);
    setProgress((stepIndex / steps.length) * 100);
    setProcessingDetails('');
  }, [steps.length]);

  // Calculate estimated time remaining
  const calculateTimeRemaining = useCallback(() => {
    if (!workflowStartTime.current || currentStep === 0) return 0;
    
    const elapsedTime = Date.now() - workflowStartTime.current;
    const avgTimePerStep = elapsedTime / Math.max(currentStep, 1);
    const remainingSteps = steps.length - currentStep;
    
    return Math.max(0, (remainingSteps * avgTimePerStep) / 1000); // Convert to seconds
  }, [currentStep, steps.length]);

  // Update metrics periodically
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      if (!workflowStartTime.current || currentStep === 0) return;
      
      const elapsedTime = Date.now() - workflowStartTime.current;
      const avgTimePerStep = elapsedTime / Math.max(currentStep, 1);
      const remainingSteps = steps.length - currentStep;
      const timeRemaining = Math.max(0, (remainingSteps * avgTimePerStep) / 1000);
      
      setWorkflowMetrics(prev => ({
        ...prev,
        estimatedTimeRemaining: timeRemaining
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isProcessing, currentStep, steps.length]);

  // Reset workflow with enhanced cleanup
  const resetWorkflow = useCallback(() => {
    console.log('Resetting enhanced workflow state');
    
    // Clean up any existing audio URLs
    if (audioData?.url) {
      try {
        URL.revokeObjectURL(audioData.url);
        console.log('Revoked previous audio URL');
      } catch (error) {
        console.error('Error revoking URL:', error);
      }
    }
    
    setAudioData(null);
    setTranscript('');
    setGeneratedBrief('');
    setBriefId(null);
    setSteps(PROCESSING_STEPS.map(step => ({ 
      ...step, 
      status: 'pending' as const,
      retryCount: 0,
      startTime: undefined,
      endTime: undefined,
      duration: undefined,
      metrics: undefined
    })));
    setCurrentStep(0);
    setProgress(0);
    setIsProcessing(false);
    setProcessingDetails('');
    setRequestId('');
    setWorkflowMetrics({
      processingSpeed: 0,
      qualityScore: 0,
      confidenceLevel: 0,
      estimatedTimeRemaining: 0
    });
    setErrorHistory([]);
    
    // Clear timing refs
    workflowStartTime.current = null;
    stepTimers.current.clear();
  }, [audioData]);

  // Get workflow statistics
  const getWorkflowStats = useCallback(() => {
    const completedSteps = steps.filter(step => step.status === 'completed');
    const errorSteps = steps.filter(step => step.status === 'error');
    const totalDuration = completedSteps.reduce((sum, step) => sum + (step.duration || 0), 0);
    const avgStepDuration = completedSteps.length > 0 ? totalDuration / completedSteps.length : 0;
    
    return {
      completedSteps: completedSteps.length,
      errorSteps: errorSteps.length,
      totalSteps: steps.length,
      totalDuration,
      avgStepDuration,
      successRate: steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0,
      totalRetries: steps.reduce((sum, step) => sum + (step.retryCount || 0), 0)
    };
  }, [steps]);

  return {
    // Original state
    currentStep,
    setCurrentStep,
    progress,
    setProgress,
    transcript,
    setTranscript,
    generatedBrief,
    setGeneratedBrief,
    isProcessing,
    setIsProcessing,
    audioData,
    setAudioData,
    steps,
    setSteps,
    briefId,
    setBriefId,
    processingDetails,
    setProcessingDetails,
    requestId,
    setRequestId,
    
    // Enhanced functionality
    workflowMetrics,
    errorHistory,
    startWorkflow,
    updateStepStatus,
    retryStep,
    resetWorkflow,
    getWorkflowStats,
    
    // Computed values
    estimatedTimeRemaining: workflowMetrics.estimatedTimeRemaining,
    isComplete: steps.every(step => step.status === 'completed'),
    hasErrors: steps.some(step => step.status === 'error')
  };
}