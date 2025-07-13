import { supabase } from '@/integrations/supabase/client';
import { TemplateType } from '@/types';

export function useBriefGenerator() {
  const generate = async (
    transcript: string,
    template: TemplateType,
    workflowId: string,
    updateProgress: (progress: number) => void
  ): Promise<string> => {
    console.log(`[${workflowId}] Starting brief generation with template: ${template}`);
    
    try {
      // Initial progress
      updateProgress(10);
      
      if (!transcript || transcript.trim().length < 10) {
        throw new Error('Transcript is too short for brief generation');
      }
      
      // Update progress as we prepare the request
      updateProgress(30);

      console.log(`[${workflowId}] Sending transcript (${transcript.length} chars) to brief generation service`);
      
      // Call the brief generation function
      const { data: briefData, error: briefError } = await supabase.functions.invoke('generate-brief-with-gemini', {
        body: {
          transcriptionText: transcript,
          options: {
            templateType: template,
            tone: 'professional',
            length: 'detailed',
            enhancedFormatting: true,
            includeMetrics: true
          }
        }
      });

      // Progress update after API call
      updateProgress(70);

      if (briefError) {
        console.error(`[${workflowId}] Brief generation API error:`, briefError);
        throw new Error(briefError.message || 'Brief generation service failed');
      }
      
      if (!briefData) {
        console.error(`[${workflowId}] No data returned from brief generation service`);
        throw new Error('No data received from brief generation service');
      }
      
      if (!briefData.brief) {
        console.error(`[${workflowId}] No brief content in response:`, briefData);
        throw new Error('No brief content received');
      }
      
      // Final progress
      updateProgress(100);
      
      console.log(`[${workflowId}] Brief generated successfully: ${briefData.brief.length} chars`);
      return briefData.brief;
      
    } catch (error) {
      console.error(`[${workflowId}] Brief generation error:`, error);
      throw error;
    }
  };

  const save = async (
    transcript: string,
    brief: string,
    template: TemplateType,
    userId: string,
    workflowId: string,
    refreshDashboard?: () => void
  ): Promise<string> => {
    console.log(`[${workflowId}] Saving content to database`);

    try {
      if (!userId) {
        throw new Error('User ID is required to save content');
      }
      
      if (!transcript || !brief) {
        throw new Error('Both transcript and brief are required');
      }

      console.log(`[${workflowId}] Saving transcript (${transcript.length} chars) to database for user ${userId}`);
      
      // Save transcript
      const transcriptResponse = await supabase
        .from('transcripts')
        .insert({
          user_id: userId,
          original_text: transcript,
          source_type: 'upload',
          created_at: new Date().toISOString(),
          metadata: {
            wordCount: transcript.split(/\s+/).length,
            charCount: transcript.length,
            workflowId: workflowId
          }
        })
        .select('id')
        .single();

      if (transcriptResponse.error) {
        console.error(`[${workflowId}] Error saving transcript for user ${userId}:`, transcriptResponse.error, { transcriptLength: transcript.length });
        throw new Error('Failed to save transcript to database');
      }

      if (!transcriptResponse.data || !transcriptResponse.data.id) {
        throw new Error('No transcript ID returned after saving');
      }

      const transcriptId = transcriptResponse.data.id;
      console.log(`[${workflowId}] Transcript saved for user ${userId} with ID: ${transcriptId} (length: ${transcript.length})`);
      
      console.log(`[${workflowId}] Saving brief (${brief.length} chars) to database for user ${userId}`);

      // Save brief
      const briefResponse = await supabase
        .from('briefs')
        .insert({
          transcript_id: transcriptId,
          template: template,
          content_md: brief,
          created_at: new Date().toISOString(),
          metadata: {
            wordCount: brief.split(/\s+/).length,
            charCount: brief.length,
            workflowId: workflowId
          }
        })
        .select('id')
        .single();

      if (briefResponse.error) {
        console.error(`[${workflowId}] Error saving brief for user ${userId}:`, briefResponse.error, { briefLength: brief.length });
        throw new Error('Failed to save brief to database');
      }

      if (!briefResponse.data || !briefResponse.data.id) {
        throw new Error('No brief ID returned after saving');
      }

      console.log(`[${workflowId}] Brief saved successfully for user ${userId} with ID: ${briefResponse.data.id} (length: ${brief.length})`);
      if (typeof refreshDashboard === 'function') {
        refreshDashboard();
      }
      return briefResponse.data.id;
      
    } catch (error) {
      console.error(`[${workflowId}] Database save error for user ${userId}:`, error);
      throw error;
    }
  };

  const saveEdited = async (briefId: string, editedBrief: string): Promise<void> => {
    const { error } = await supabase
      .from('briefs')
      .update({ content_md: editedBrief })
      .eq('id', briefId);

    if (error) {
      throw new Error('Failed to save changes');
    }
  };

  return {
    generate,
    save,
    saveEdited,
  };
}