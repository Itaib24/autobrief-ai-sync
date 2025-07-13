import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProcessingStep } from '@/types/audio';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Upload,
  Mic,
  Search,
  Sparkles,
  Zap,
  Brain,
  FileText,
  Timer,
  TrendingUp,
  Activity
} from 'lucide-react';

interface WorkflowProgressProps {
  steps: ProcessingStep[];
  currentStep: number;
  progress: number;
  error?: string | null;
  onRetry?: () => void;
}

export function WorkflowProgress({ 
  steps, 
  currentStep, 
  progress, 
  error, 
  onRetry 
}: WorkflowProgressProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [animatingSteps, setAnimatingSteps] = useState<Set<number>>(new Set());
  const [pulseActive, setPulseActive] = useState(true);

  // Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animate step transitions
  useEffect(() => {
    if (steps[currentStep]?.status === 'processing') {
      setAnimatingSteps(new Set([currentStep]));
      const timer = setTimeout(() => {
        setAnimatingSteps(new Set());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, steps]);

  // Toggle pulse effect
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseActive(prev => !prev);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStepIcon = (step: ProcessingStep, index: number) => {
    const iconClass = "w-5 h-5";
    
    switch (step.type) {
      case 'upload':
        return <Upload className={iconClass} />;
      case 'transcription':
        return <Mic className={iconClass} />;
      case 'analysis':
        return <Search className={iconClass} />;
      case 'generation':
        return <Sparkles className={iconClass} />;
      default:
        return <FileText className={iconClass} />;
    }
  };

  const getStepColor = (step: ProcessingStep, index: number) => {
    if (step.status === 'completed') return 'text-green-600';
    if (step.status === 'error') return 'text-red-600';
    if (step.status === 'processing' || index === currentStep) return 'text-blue-600';
    return 'text-gray-400';
  };

  const getProgressColor = () => {
    if (error) return 'bg-red-500';
    return 'bg-blue-500';
  };

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  const overallProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const getEstimatedTimeRemaining = () => {
    const avgTimePerStep = timeElapsed / Math.max(completedSteps, 1);
    const remainingSteps = totalSteps - completedSteps;
    return Math.max(0, Math.round(avgTimePerStep * remainingSteps));
  };

  return (
    <div className="h-screen flex flex-col p-6 space-y-4 overflow-hidden">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Processing Brief
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI is analyzing your content
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{Math.round(overallProgress)}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Complete</div>
        </div>
      </div>

      {/* Compact Progress Bar */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  {formatTime(timeElapsed)}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {completedSteps < totalSteps 
                    ? `${formatTime(getEstimatedTimeRemaining())} left`
                    : 'Done'
                  }
                </span>
              </div>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Compact Steps Grid */}
      <div className="flex-1 overflow-hidden">
        <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700 h-full">
          <CardContent className="p-4 h-full overflow-auto">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-max">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    animatingSteps.has(index) 
                      ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800' 
                      : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
                  } ${step.status === 'processing' ? 'ring-2 ring-blue-500/20' : ''}`}
                >
                  {/* Step Icon */}
                  <div className={`flex-shrink-0 p-2.5 rounded-lg transition-all duration-300 ${
                    step.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-950/30' 
                      : step.status === 'error'
                      ? 'bg-red-100 dark:bg-red-950/30'
                      : step.status === 'processing' || index === currentStep
                      ? 'bg-blue-100 dark:bg-blue-950/30'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : step.status === 'error' ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : step.status === 'processing' || index === currentStep ? (
                      <div className={`${getStepColor(step, index)} ${pulseActive ? 'animate-pulse' : ''}`}>
                        {getStepIcon(step, index)}
                      </div>
                    ) : (
                      <div className={getStepColor(step, index)}>
                        {getStepIcon(step, index)}
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate text-sm">
                        {step.name}
                      </h3>
                      <Badge 
                        variant={
                          step.status === 'completed' ? 'default' :
                          step.status === 'error' ? 'destructive' :
                          step.status === 'processing' ? 'secondary' : 'outline'
                        }
                        className="text-xs ml-2"
                      >
                        {step.status === 'completed' ? 'Done' :
                         step.status === 'error' ? 'Error' :
                         step.status === 'processing' ? 'Active' : 'Pending'}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {step.description || step.name}
                    </p>

                    {/* Step Progress for current processing step */}
                    {(step.status === 'processing' || index === currentStep) && progress > 0 && (
                      <div className="mt-2">
                        <Progress value={progress} className="h-1" />
                      </div>
                    )}
                  </div>

                  {/* Activity Indicator */}
                  {step.status === 'processing' && (
                    <div className="flex-shrink-0">
                      <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 text-sm">
                      Processing Error
                    </h4>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                      {error}
                    </p>
                    {onRetry && (
                      <Button
                        onClick={onRetry}
                        variant="outline"
                        size="sm"
                        className="mt-2 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 text-xs"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Try Again
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compact Footer */}
      <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
        <CardContent className="p-3">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Advanced AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              <span>NLP Processing</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}