import { supabase } from '@/integrations/supabase/client';
import { AudioData } from '@/types/audio';

export function useAudioProcessor() {
  const processFile = async (file: File, updateProgress: (progress: number) => void) => {
    // Validate file
    if (!file || file.size === 0) {
      throw new Error('Audio file is empty or invalid');
    }
    
    if (file.size > 25 * 1024 * 1024) { // 25MB limit
      throw new Error('Audio file is too large. Please use files under 25MB.');
    }

    // File validation passed
    updateProgress(10);
  };

  const transcribe = async (
    audioData: AudioData,
    workflowId: string,
    updateProgress: (progress: number) => void
  ): Promise<string> => {
    console.log(`[${workflowId}] Starting transcription for file: ${audioData.file.name}`);
    
    try {
      // Validate input
      if (!audioData || !audioData.file) {
        throw new Error('No audio file provided for transcription');
      }
      
      // Convert audio to base64
      updateProgress(20);
      console.log(`[${workflowId}] Converting file to base64...`);
      
      const reader = new FileReader();
      const audioBase64 = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => {
          if (e.target?.result) {
            console.log(`[${workflowId}] File successfully converted to base64`);
            resolve(e.target.result as string);
          } else {
            reject(new Error('Failed to convert file to base64'));
          }
        };
        reader.onerror = (error) => {
          console.error(`[${workflowId}] Error reading file:`, error);
          reject(new Error('Failed to read audio file'));
        };
        reader.readAsDataURL(audioData.file);
      });
      
      if (!audioBase64 || !audioBase64.includes('base64,')) {
        throw new Error('Failed to convert audio file to base64 format');
      }

      updateProgress(40);

      // Determine audio format
      const audioFormat = audioData.file.type.includes('mp3') ? 'mp3' : 
                         audioData.file.type.includes('wav') ? 'wav' :
                         audioData.file.type.includes('m4a') ? 'm4a' : 
                         audioData.file.type.includes('webm') ? 'webm' : 
                         audioData.file.type.includes('ogg') ? 'ogg' : 'mp3';
      
      console.log(`[${workflowId}] Audio format detected: ${audioFormat}`);
      updateProgress(50);

      console.log(`[${workflowId}] Sending to transcription service...`);
      // Call transcription service
      const { data: transcriptData, error: transcriptError } = await supabase.functions.invoke('transcribe-audio-enhanced', {
        body: { 
          audioData: audioBase64, 
          audioFormat,
          options: {
            enableSpeakerDiarization: false,
            enableProfanityFilter: false,
            languageCode: 'en-US',
            enableWordTimeOffsets: false,
            enableAutomaticPunctuation: true,
            model: 'latest_long',
            useEnhanced: true
          },
          originalFilename: audioData.file.name,
          fileSizeBytes: audioData.file.size
        }
      });

      if (transcriptError) {
        console.error(`[${workflowId}] Transcription API error:`, transcriptError);
        throw new Error(transcriptError.message || 'Transcription service failed');
      }
      
      if (!transcriptData) {
        console.error(`[${workflowId}] No data returned from transcription service`);
        throw new Error('No data received from transcription service');
      }
      
      if (transcriptData.error) {
        console.error(`[${workflowId}] Error in transcription response:`, transcriptData.error);
        throw new Error(transcriptData.error || 'Transcription service returned an error');
      }
      
      if (!transcriptData.fullText) {
        console.error(`[${workflowId}] No transcription text in response:`, transcriptData);
        throw new Error('No transcription text received');
      }
      
      updateProgress(100);
      
      console.log(`[${workflowId}] Transcription complete: ${transcriptData.fullText.length} chars`);
      return transcriptData.fullText;
      
    } catch (error) {
      console.error(`[${workflowId}] Transcription error:`, error);
      throw error;
    }
  };

  return {
    processFile,
    transcribe,
  };
}