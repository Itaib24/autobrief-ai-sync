import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TemplateType } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Simplified, focused hooks
import { useEnhancedWorkflowState } from '@/hooks/useEnhancedWorkflowState';
import { useAudioProcessor } from '@/hooks/useAudioProcessor';
import { useBriefGenerator } from '@/hooks/useBriefGenerator';
import { useFileStorage } from '@/hooks/useFileStorage';

// Enhanced components
import { ModernAudioUpload } from '../upload/ModernAudioUpload';
import { AudioFile } from '@/types/audio';
import { WorkflowProgress } from './WorkflowProgress';
import { AudioPreview } from './AudioPreview';
import { WorkflowControls } from './WorkflowControls';
import { LiveBriefDisplay } from '@/components/results/LiveBriefDisplay';
import { SuccessMessage } from '@/components/audio/SuccessMessage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  RefreshCw, 
  HelpCircle, 
  ExternalLink, 
  CheckCircle,
  Zap,
  Clock,
  Shield,
  Lightbulb
} from 'lucide-react';

interface Props {
  selectedTemplate: TemplateType;
  onComplete: (briefId: string) => void;
}

// Enhanced error types for better UX
interface ErrorInfo {
  type: 'network' | 'file' | 'processing' | 'quota' | 'unknown';
  title: string;
  message: string;
  suggestions: string[];
  canRetry: boolean;
  helpUrl?: string;
}

const getErrorInfo = (error: string): ErrorInfo => {
  if (error.includes('network') || error.includes('fetch')) {
    return {
      type: 'network',
      title: 'Connection Issue',
      message: 'Unable to connect to our servers. Please check your internet connection.',
      suggestions: [
        'Check your internet connection',
        'Try refreshing the page',
        'Wait a moment and try again'
      ],
      canRetry: true,
      helpUrl: 'https://help.autobrief.ai/connection-issues'
    };
  }
  
  if (error.includes('limit') || error.includes('quota')) {
    return {
      type: 'quota',
      title: 'Monthly Limit Reached',
      message: 'You\'ve reached your monthly brief generation limit.',
      suggestions: [
        'Upgrade to a higher plan',
        'Wait until next month',
        'Contact support for assistance'
      ],
      canRetry: false,
      helpUrl: 'https://help.autobrief.ai/upgrade-plan'
    };
  }
  
  if (error.includes('file') || error.includes('audio') || error.includes('format')) {
    return {
      type: 'file',
      title: 'Audio File Issue',
      message: 'There was a problem with your audio file.',
      suggestions: [
        'Try a different audio format (MP3, WAV)',
        'Ensure the file is under 100MB',
        'Check that the audio has clear speech',
        'Reduce background noise if possible'
      ],
      canRetry: true,
      helpUrl: 'https://help.autobrief.ai/audio-requirements'
    };
  }
  
  if (error.includes('transcription') || error.includes('speech')) {
    return {
      type: 'processing',
      title: 'Transcription Failed',
      message: 'We couldn\'t transcribe your audio clearly.',
      suggestions: [
        'Ensure speakers are speaking clearly',
        'Reduce background noise',
        'Try a higher quality audio file',
        'Check if the audio contains speech'
      ],
      canRetry: true,
      helpUrl: 'https://help.autobrief.ai/transcription-tips'
    };
  }
  
  return {
    type: 'unknown',
    title: 'Something Went Wrong',
    message: error || 'An unexpected error occurred during processing.',
    suggestions: [
      'Try the process again',
      'Refresh the page',
      'Contact support if the issue persists'
    ],
    canRetry: true,
    helpUrl: 'https://help.autobrief.ai/contact'
  };
};

export function BriefGenerationWorkflow({ selectedTemplate, onComplete }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Storage hook for file uploads
  const fileStorage = useFileStorage();
  
  // Simplified state management  
  const {
    currentStep,
    progress,
    transcript,
    setTranscript,
    generatedBrief,
    setGeneratedBrief,
    isProcessing,
    setIsProcessing,
    audioData,
    setAudioData,
    steps,
    briefId,
    setBriefId,
    updateStepStatus,
    startWorkflow,
    resetWorkflow,
    estimatedTimeRemaining,
    isComplete,
    hasErrors
  } = useEnhancedWorkflowState();
  
  const audioProcessor = useAudioProcessor();
  const briefGenerator = useBriefGenerator();
  const [workflowError, setWorkflowError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const handleFilesSelect = async (audioFiles: AudioFile[]) => {
    if (audioFiles.length === 0) return;
    
    const firstFile = audioFiles[0];
    if (firstFile.uploadStatus !== 'completed') {
      toast({
        title: "File Processing Error",
        description: "Selected audio file is not ready for processing",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log(`Processing file: ${firstFile.name} (${firstFile.size} bytes) with ID: ${firstFile.id}`);
      
      // Clear any previous audio data and errors
      if (audioData?.url) {
        try {
          URL.revokeObjectURL(audioData.url);
          console.log("Revoked previous audio URL");
        } catch (error) {
          console.error("Error revoking URL:", error);
        }
      }
      
      setWorkflowError(null);
      setRetryCount(0);
      
      // Process the file
      await audioProcessor.processFile(firstFile.file, () => {});
      
      // Create a fresh URL for the file to avoid caching issues
      const freshUrl = URL.createObjectURL(firstFile.file);
      
      // Create audio data object with unique URL
      const audioDataObj = {
        file: firstFile.file,
        url: freshUrl,
        duration: firstFile.duration || 0,
        size: firstFile.sizeFormatted || `${(firstFile.file.size / (1024 * 1024)).toFixed(1)} MB`
      };
      
      // Save audio data
      setAudioData(audioDataObj);
      
      // Update workflow state
      updateStepStatus(0, 'completed', `Audio file ready: ${firstFile.name}`);
      
      toast({
        title: "✅ File Ready",
        description: `${firstFile.name} is ready for processing`,
      });
    } catch (error) {
      console.error('File selection error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to process audio file";
      setWorkflowError(errorMessage);
      
      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const processWorkflow = async () => {
    if (!audioData || !user) {
      toast({
        title: "Processing Error",
        description: "No audio file selected or user not authenticated",
        variant: "destructive",
      });
      return;
    }
    
    const workflowId = crypto.randomUUID();
    console.log(`[${workflowId}] Starting workflow for file: ${audioData.file.name}`);
    
    try {
      setWorkflowError(null);
      
      // Check subscription limits first
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('briefs_count, briefs_limit')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error(`[${workflowId}] Error checking subscription limits:`, profileError);
        throw new Error('Failed to verify subscription limits');
      }

      const currentCount = userProfile?.briefs_count || 0;
      const maxLimit = userProfile?.briefs_limit || 10;
      
      if (maxLimit !== -1 && currentCount >= maxLimit) {
        throw new Error(`Monthly limit reached (${currentCount}/${maxLimit}). Please upgrade your plan.`);
      }

      // Create a fresh copy of the audio data to avoid caching issues
      const freshAudioData = {
        ...audioData,
        file: new File([audioData.file], audioData.file.name, { type: audioData.file.type }),
        url: URL.createObjectURL(audioData.file)
      };
      
      // Start processing
      startWorkflow();
      updateStepStatus(0, 'completed', `Audio file: ${freshAudioData.file.name}`);
      
      // Step 1: Transcription
      updateStepStatus(1, 'processing', 'Converting speech to text...');
      console.log(`[${workflowId}] Starting transcription process for ${freshAudioData.file.name}`);
      
      const updateTranscriptionProgress = (progress: number) => {
        updateStepStatus(1, 'processing', `Transcribing audio... ${progress.toFixed(0)}%`);
      };
      
      const transcriptText = await audioProcessor.transcribe(
        freshAudioData, 
        workflowId, 
        updateTranscriptionProgress
      );
      
      if (!transcriptText || transcriptText.trim().length < 10) {
        console.error(`[${workflowId}] Transcription too short or empty: "${transcriptText}"`);
        throw new Error('No meaningful content transcribed. Please check audio quality.');
      }

      console.log(`[${workflowId}] Transcription complete: ${transcriptText.length} chars`);
      setTranscript(transcriptText);
      updateStepStatus(1, 'completed', `Transcribed ${transcriptText.split(' ').length} words`);
      
      // Step 2: Analysis
      updateStepStatus(2, 'processing', 'Analyzing content structure...');
      console.log(`[${workflowId}] Starting content analysis`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate analysis
      updateStepStatus(2, 'completed', 'Content analysis complete');
      
      // Step 3: Brief Generation
      updateStepStatus(3, 'processing', 'Generating professional brief...');
      console.log(`[${workflowId}] Starting brief generation`);
      
      const updateBriefProgress = (progress: number) => {
        updateStepStatus(3, 'processing', `Generating brief... ${progress.toFixed(0)}%`);
      };
      
      const brief = await briefGenerator.generate(
        transcriptText,
        selectedTemplate,
        workflowId,
        updateBriefProgress
      );

      if (!brief || brief.trim().length < 50) {
        console.error(`[${workflowId}] Brief generation failed, output too short: ${brief?.length || 0} chars`);
        throw new Error('Brief generation failed. Please try again.');
      }

      console.log(`[${workflowId}] Brief generation complete: ${brief.length} chars`);
      setGeneratedBrief(brief);
      updateStepStatus(3, 'completed', 'Professional brief generated');

      // Save to database
      console.log(`[${workflowId}] Saving results to database`);
      
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Step 4: Upload file to storage
      updateStepStatus(4, 'processing', 'Uploading audio file to storage...');
      let fileUrl: string | null = null;
      
      try {
        fileUrl = await fileStorage.uploadFile(freshAudioData.file, workflowId);
        console.log(`[${workflowId}] File uploaded to storage: ${fileUrl}`);
        updateStepStatus(4, 'completed', 'Audio file saved to storage');
      } catch (uploadError) {
        console.warn(`[${workflowId}] File upload failed, continuing without file URL:`, uploadError);
        updateStepStatus(4, 'error', 'File upload failed (continuing without storage)');
        // Continue without file URL - this is not critical for the workflow
      }

      // Step 5: Save results to database
      updateStepStatus(5, 'processing', 'Saving transcript and brief to database...');
      
      const { data: transcriptData, error: transcriptError } = await supabase
        .from('transcripts')
        .insert({
          user_id: currentUser.id,
          original_text: transcriptText,
          source_type: 'audio_upload',
          original_file_url: fileUrl
        })
        .select()
        .single();

      if (transcriptError) {
        console.error(`[${workflowId}] Transcript save error for user ${currentUser.id}:`, transcriptError, { transcriptLength: transcriptText.length });
        toast({
          title: "Transcript Save Failed",
          description: transcriptError.message || 'Failed to save transcription',
          variant: "destructive",
        });
        throw new Error('Failed to save transcription');
      } else {
        console.log(`[${workflowId}] Transcript saved for user ${currentUser.id} with ID: ${transcriptData.id} (length: ${transcriptText.length})`);
      }

      // Save brief to database
      const { data: briefData, error: briefError } = await supabase
        .from('briefs')
        .insert({
          transcript_id: transcriptData.id,
          template: selectedTemplate,
          content_md: brief,
          sent: false
        })
        .select()
        .single();

      if (briefError) {
        console.error(`[${workflowId}] Brief save error for user ${currentUser.id}:`, briefError, { briefLength: brief.length });
        toast({
          title: "Brief Save Failed",
          description: briefError.message || 'Failed to save brief',
          variant: "destructive",
        });
        throw new Error('Failed to save brief');
      } else {
        console.log(`[${workflowId}] Brief saved for user ${currentUser.id} with ID: ${briefData.id} (length: ${brief.length})`);
      }

      setBriefId(briefData.id);
      
      // Update user profile brief count
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ briefs_count: currentCount + 1 })
        .eq('user_id', currentUser.id);

      if (updateError) {
        console.error(`[${workflowId}] Error updating brief count for user ${currentUser.id}:`, updateError);
        // Don't throw here as the brief was created successfully
      }

      // Mark save step as completed
      updateStepStatus(5, 'completed', 'Results saved successfully');

      // Force dashboard/history refresh if available
      if (typeof onComplete === 'function') {
        onComplete(briefData.id);
      }

      toast({
        title: "🎉 Brief Generated Successfully!",
        description: "Your professional brief is ready for review and has been saved to storage.",
      });

    } catch (error) {
      console.error(`[${workflowId}] Workflow error:`, error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setWorkflowError(errorMessage);
      
      // Update step status to show error
      updateStepStatus(currentStep, 'error', 'Processing failed');
      
      toast({
        title: "Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const saveEditedBrief = async (editedContent: string) => {
    if (!briefId) return;
    
    try {
      const { error } = await supabase
        .from('briefs')
        .update({ content_md: editedContent })
        .eq('id', briefId);

      if (error) throw error;

      setGeneratedBrief(editedContent);
      toast({
        title: "Brief Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving brief:', error);
      toast({
        title: "Save Error",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setWorkflowError(null);
    resetWorkflow();
    
    // Add a small delay for better UX
    setTimeout(() => {
      processWorkflow();
    }, 500);
  };

  const errorInfo = workflowError ? getErrorInfo(workflowError) : null;

  return (
    <div className="space-y-6">
      {/* Enhanced Error Display */}
      {errorInfo && (
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200 text-lg">
                    {errorInfo.title}
                  </h3>
                  <p className="text-red-700 dark:text-red-300 mt-1">
                    {errorInfo.message}
                  </p>
                </div>

                {/* Suggestions */}
                <div className="space-y-2">
                  <h4 className="font-medium text-red-800 dark:text-red-200 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Suggestions:
                  </h4>
                  <ul className="space-y-1">
                    {errorInfo.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  {errorInfo.canRetry && (
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950/30"
                      disabled={retryCount >= 3}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {retryCount > 0 ? `Retry (${3 - retryCount} left)` : 'Try Again'}
                    </Button>
                  )}
                  
                  {errorInfo.helpUrl && (
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30"
                      onClick={() => window.open(errorInfo.helpUrl, '_blank')}
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Get Help
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>

                {/* Retry limit warning */}
                {retryCount >= 3 && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Retry Limit Reached</AlertTitle>
                    <AlertDescription>
                      Please check the suggestions above or contact support for assistance.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Upload */}
      {!audioData && (
        <div className="animate-fade-in">
          <ModernAudioUpload 
            onFilesSelect={handleFilesSelect}
            isProcessing={isProcessing}
            options={{
              maxFiles: 1,
              enablePreview: false, // Disable for faster uploads
              enableWaveform: false // Disable for faster uploads
            }}
            enableRealTimeProgress={false} // Disable artificial delays
          />
        </div>
      )}

      {/* Audio Preview */}
      {audioData && (
        <div className="animate-fade-in">
          <AudioPreview 
            audioData={audioData}
            isProcessing={isProcessing}
          />
        </div>
      )}

      {/* Controls */}
      <WorkflowControls
        audioData={audioData}
        isProcessing={isProcessing}
        hasResults={!!generatedBrief}
        onStartProcessing={processWorkflow}
        onReset={resetWorkflow}
      />

      {/* Processing Display */}
      {isProcessing && (
        <div className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-50">
          <WorkflowProgress
            steps={steps}
            currentStep={currentStep}
            progress={progress}
            error={hasErrors ? workflowError : null}
            onRetry={handleRetry}
          />
        </div>
      )}

      {/* Results Display */}
      {!isProcessing && transcript && generatedBrief && (
        <div className="animate-fade-in space-y-6">
          <LiveBriefDisplay
            transcript={transcript}
            generatedBrief={generatedBrief}
            selectedTemplate={selectedTemplate}
            onSaveBrief={saveEditedBrief}
          />
        </div>
      )}

      {/* Success Message */}
      {generatedBrief && briefId && (
        <div className="animate-fade-in">
          <SuccessMessage
            briefId={briefId}
            onReset={resetWorkflow}
          />
        </div>
      )}

      {/* Security & Privacy Notice */}
      {audioData && !isProcessing && (
        <Card className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Your audio is processed securely and deleted after brief generation.</span>
              <Badge variant="outline" className="ml-auto">
                <Clock className="w-3 h-3 mr-1" />
                Auto-delete in 24h
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}