import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  console.log(`[${requestId}] Starting Gladia.io transcription`);

  try {
    const { audioData, audioFormat, options = {} } = await req.json();
    
    if (!audioData) {
      throw new Error('No audio data provided');
    }

    console.log(`[${requestId}] Audio format: ${audioFormat}, data length: ${audioData.length}`);

    // Get Gladia API key
    const apiKey = Deno.env.get('GLADIA_API_KEY');
    if (!apiKey) {
      throw new Error('Gladia API key not configured. Please add GLADIA_API_KEY to Supabase secrets.');
    }

    console.log(`[${requestId}] Using Gladia API key: ${apiKey.substring(0, 10)}...`);

    // Convert base64 to audio buffer for upload
    const processedAudioData = audioData.replace(/^data:audio\/[^;]+;base64,/, '');
    const audioBuffer = Uint8Array.from(atob(processedAudioData), (c) => c.charCodeAt(0));

    console.log(`[${requestId}] Uploading audio to Gladia.io...`);

    // Create FormData for multipart upload
    const formData = new FormData();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    formData.append('audio', audioBlob, 'audio.mp3');

    // Upload audio file to Gladia
    const uploadResponse = await fetch('https://api.gladia.io/v2/upload', {
      method: 'POST',
      headers: {
        'x-gladia-key': apiKey,
      },
      body: formData
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error(`[${requestId}] Upload failed:`, errorText);
      throw new Error(`Failed to upload audio to Gladia: ${errorText}`);
    }

    const uploadData = await uploadResponse.json();
    const audioUrl = uploadData.audio_url;
    console.log(`[${requestId}] Audio uploaded successfully to: ${audioUrl}`);

    // Configure transcription request with the correct Gladia parameters
    const transcriptionData = {
      audio_url: audioUrl,
      // Use language_config for language specification
      language_config: {
        language: options.languageCode ? undefined : 'en',
        detect_language: !options.languageCode,
        languages: options.languageCode ? [options.languageCode.split('-')[0]] : ['en'],
      },
      // Speaker diarization
      diarization: options.enableSpeakerDiarization || false
    };

    console.log(`[${requestId}] Starting transcription with config:`, JSON.stringify(transcriptionData, null, 2));

    // Start transcription
    const transcriptionResponse = await fetch('https://api.gladia.io/v2/transcription', {
      method: 'POST',
      headers: {
        'x-gladia-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transcriptionData)
    });

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error(`[${requestId}] Transcription request failed:`, errorText);
      throw new Error(`Failed to start transcription: ${errorText}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    
    if (!transcriptionResult.id) {
      console.error(`[${requestId}] No transcription ID received:`, transcriptionResult);
      throw new Error('No transcription ID received from Gladia');
    }

    const transcriptionId = transcriptionResult.id;
    console.log(`[${requestId}] Transcription started with ID: ${transcriptionId}`);

    // Poll for completion
    const pollingEndpoint = `https://api.gladia.io/v2/transcription/${transcriptionId}`;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max (60 * 5 seconds)

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`[${requestId}] Polling attempt ${attempts}/${maxAttempts}`);

      const pollingResponse = await fetch(pollingEndpoint, {
        headers: {
          'x-gladia-key': apiKey
        }
      });

      if (!pollingResponse.ok) {
        const errorText = await pollingResponse.text();
        console.error(`[${requestId}] Polling failed:`, errorText);
        throw new Error(`Failed to poll transcription: ${errorText}`);
      }

      const result = await pollingResponse.json();
      console.log(`[${requestId}] Transcription status: ${result.status}`);

      if (result.status === 'done') {
        console.log(`[${requestId}] Transcription completed successfully`);
        
        // Extract transcript text
        const fullText = result.result?.transcription?.full_transcript || '';
        console.log(`[${requestId}] Full transcript: "${fullText}"`);
        console.log(`[${requestId}] Transcript length: ${fullText.length} characters`);

        if (!fullText || fullText.trim().length === 0) {
          console.error(`[${requestId}] Empty transcript received. Full result:`, JSON.stringify(result, null, 2));
          throw new Error('No speech detected in audio. Please ensure your audio contains clear speech.');
        }

        // Process segments for speaker diarization
        const segments = processGladiaSegments(result.result?.transcription?.utterances || [], requestId);
        
        // Calculate metadata
        const wordCount = fullText.split(/\s+/).filter(w => w.length > 0).length;
        const speakerCount = segments.length > 0 ? new Set(segments.map(s => s.speaker)).size : 1;
        const processingTime = Date.now() - startTime;

        // Calculate average confidence
        let totalConfidence = 0;
        let confidenceCount = 0;
        
        if (result.result?.transcription?.utterances) {
          for (const utterance of result.result.transcription.utterances) {
            if (utterance.confidence !== undefined) {
              totalConfidence += utterance.confidence;
              confidenceCount++;
            }
          }
        }
        
        const averageConfidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0.9;

        // Build final result
        const finalResult = {
          success: true,
          id: requestId,
          fullText: fullText,
          transcript: fullText,
          transcription: fullText,
          text: fullText,
          segments: segments,
          metadata: {
            duration: result.result?.transcription?.metadata?.duration || '00:00:00',
            wordCount: wordCount,
            speakerCount: speakerCount,
            averageConfidence: Math.round(averageConfidence * 100) / 100,
            languageDetected: result.result?.transcription?.metadata?.detected_language || 'en',
            processingTime: processingTime
          },
          qualityScore: Math.min(1.0, averageConfidence * (wordCount > 10 ? 1 : 0.8)),
          warnings: generateWarnings(wordCount, averageConfidence),
          debug: {
            gladiaResponse: result,
            transcriptionId: transcriptionId,
            attempts: attempts
          }
        };

        console.log(`[${requestId}] Final result - Word count: ${wordCount}, Confidence: ${averageConfidence}`);

        return new Response(JSON.stringify(finalResult), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });

      } else if (result.status === 'error') {
        console.error(`[${requestId}] Transcription failed:`, result.error);
        throw new Error(`Transcription failed: ${result.error || 'Unknown error'}`);
      } else {
        // Status is 'queued' or 'processing'
        console.log(`[${requestId}] Status: ${result.status}, waiting 5 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    // If we reach here, we've exceeded max attempts
    throw new Error(`Transcription timed out after ${maxAttempts} attempts (${maxAttempts * 5} seconds)`);

  } catch (error) {
    console.error(`[${requestId}] Error:`, error.message);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      requestId: requestId,
      suggestions: generateErrorSuggestions(error.message)
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});

function processGladiaSegments(utterances: any[], requestId: string): any[] {
  const segments: any[] = [];
  
  if (!utterances || utterances.length === 0) {
    return segments;
  }

  console.log(`[${requestId}] Processing ${utterances.length} utterances`);

  for (let i = 0; i < utterances.length; i++) {
    const utterance = utterances[i];
    
    segments.push({
      speaker: utterance.speaker ? `Speaker ${utterance.speaker}` : 'Speaker 1',
      startTime: formatTime(utterance.start_time || 0),
      endTime: formatTime(utterance.end_time || 0),
      text: utterance.text || '',
      confidence: utterance.confidence || 0.9,
      words: utterance.words || []
    });
  }

  return segments;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function generateWarnings(wordCount: number, averageConfidence: number): string[] {
  const warnings: string[] = [];
  
  if (averageConfidence < 0.7) {
    warnings.push('Low confidence in transcription. Consider using clearer audio.');
  }
  
  if (wordCount < 10) {
    warnings.push('Short transcription. Ensure audio contains sufficient speech.');
  }
  
  return warnings;
}

function generateErrorSuggestions(errorMessage: string): string[] {
  const suggestions: string[] = [];
  
  if (errorMessage.includes('No speech detected') || errorMessage.includes('Empty')) {
    suggestions.push('Ensure audio contains clear human speech');
    suggestions.push('Check audio volume is audible');
    suggestions.push('Try with a longer audio recording');
    suggestions.push('Reduce background noise');
  } else if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
    suggestions.push('Check Gladia API key in Supabase secrets');
    suggestions.push('Verify API key is valid and active');
    suggestions.push('Ensure you have sufficient Gladia credits');
  } else if (errorMessage.includes('upload') || errorMessage.includes('file')) {
    suggestions.push('Try with a smaller audio file');
    suggestions.push('Convert audio to MP3 format');
    suggestions.push('Check audio file is not corrupted');
  } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    suggestions.push('Try with a shorter audio file');
    suggestions.push('Check your internet connection');
    suggestions.push('Try again in a few minutes');
  }
  
  return suggestions;
}