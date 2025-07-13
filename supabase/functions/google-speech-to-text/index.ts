import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Starting speech-to-text processing`);

  try {
    const { audioData, audioFormat } = await req.json();
    
    if (!audioData) {
      throw new Error('No audio data provided');
    }

    console.log(`[${requestId}] Audio format: ${audioFormat}, data length: ${audioData.length}`);

    const googleApiKey = Deno.env.get('GOOGLE_SPEECH_TO_TEXT_API');
    if (!googleApiKey) {
      throw new Error('Google API key not configured. Please set GOOGLE_SPEECH_TO_TEXT_API in Supabase secrets.');
    }

    // Convert base64 audio to proper format for Google Speech-to-Text
    const audioBytes = audioData.replace(/^data:audio\/[^;]+;base64,/, '');
    console.log(`[${requestId}] Processed audio bytes length: ${audioBytes.length}`);

    // Determine encoding based on file type
    let encoding = 'WEBM_OPUS';
    if (audioFormat === 'mp3' || audioData.includes('data:audio/mp3') || audioData.includes('data:audio/mpeg')) {
      encoding = 'MP3';
    } else if (audioData.includes('data:audio/wav')) {
      encoding = 'LINEAR16';
    } else if (audioData.includes('data:audio/m4a') || audioData.includes('data:audio/mp4')) {
      encoding = 'MP4';
    }

    const requestBody = {
      config: {
        encoding,
        sampleRateHertz: encoding === 'LINEAR16' ? 16000 : undefined,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: true,
        model: 'latest_long',
        useEnhanced: true,
      },
      audio: {
        content: audioBytes,
      },
    };

    console.log(`[${requestId}] Using encoding: ${encoding}, sending request to Google Speech-to-Text API`);

    // Retry logic for API calls
    let response;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount <= maxRetries) {
      try {
        response = await fetch(
          `https://speech.googleapis.com/v1/speech:recognize?key=${googleApiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          }
        );
        break; // Success, exit retry loop
      } catch (fetchError) {
        retryCount++;
        console.log(`[${requestId}] Retry ${retryCount}/${maxRetries} after fetch error:`, fetchError);
        if (retryCount > maxRetries) {
          throw new Error(`Failed to connect to Google API after ${maxRetries} retries: ${fetchError.message}`);
        }
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google API error details:', errorData);
      
      if (response.status === 403) {
        throw new Error('Google API access denied. Please ensure: 1) Speech-to-Text API is enabled in Google Cloud Console, 2) API key has correct permissions, 3) Billing is enabled');
      }
      
      if (response.status === 400) {
        throw new Error('Invalid audio format or request. Please try with MP3, WAV, or other supported audio formats.');
      }
      
      throw new Error(`Google Speech-to-Text API error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    console.log(`[${requestId}] Google Speech-to-Text response received, processing results`);

    const transcript = result.results?.[0]?.alternatives?.[0]?.transcript || '';
    console.log(`[${requestId}] Transcript length: ${transcript.length} characters`);
    
    if (!transcript) {
      console.log(`[${requestId}] No transcript generated from response:`, result);
      throw new Error('No transcript generated. Please try with a clearer audio file with speech content.');
    }

    console.log(`[${requestId}] Successfully generated transcript`);
    return new Response(
      JSON.stringify({ transcript, requestId }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error(`[${requestId || 'unknown'}] Error in google-speech-to-text function:`, error);
    return new Response(
      JSON.stringify({ error: error.message, requestId: requestId || 'unknown' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});