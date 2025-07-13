-- Create core tables for AutoBrief AI application
-- This ensures the basic transcripts and briefs tables exist

-- Create transcripts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  original_text TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'audio_upload',
  original_file_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create briefs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.briefs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transcript_id UUID NOT NULL REFERENCES public.transcripts(id) ON DELETE CASCADE,
  template TEXT NOT NULL,
  content_md TEXT,
  metadata JSONB DEFAULT '{}',
  quality_score FLOAT DEFAULT 0,
  processing_time_ms INTEGER DEFAULT 0,
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transcripts_user_id ON public.transcripts(user_id);
CREATE INDEX IF NOT EXISTS idx_transcripts_created_at ON public.transcripts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_briefs_transcript_id ON public.briefs(transcript_id);
CREATE INDEX IF NOT EXISTS idx_briefs_template ON public.briefs(template);
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON public.briefs(created_at DESC);

-- Enable RLS
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for transcripts (using UUID comparison)
DROP POLICY IF EXISTS "Users can view their own transcripts" ON public.transcripts;
DROP POLICY IF EXISTS "Users can create their own transcripts" ON public.transcripts;
DROP POLICY IF EXISTS "Users can update their own transcripts" ON public.transcripts;
DROP POLICY IF EXISTS "Users can delete their own transcripts" ON public.transcripts;

CREATE POLICY "Users can view their own transcripts" 
ON public.transcripts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transcripts" 
ON public.transcripts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transcripts" 
ON public.transcripts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transcripts" 
ON public.transcripts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for briefs (using UUID comparison)
DROP POLICY IF EXISTS "Users can view their own briefs" ON public.briefs;
DROP POLICY IF EXISTS "Users can create briefs for their transcripts" ON public.briefs;
DROP POLICY IF EXISTS "Users can update their own briefs" ON public.briefs;
DROP POLICY IF EXISTS "Users can delete their own briefs" ON public.briefs;

CREATE POLICY "Users can view their own briefs" 
ON public.briefs 
FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM public.transcripts WHERE id = transcript_id));

CREATE POLICY "Users can create briefs for their transcripts" 
ON public.briefs 
FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM public.transcripts WHERE id = transcript_id));

CREATE POLICY "Users can update their own briefs" 
ON public.briefs 
FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM public.transcripts WHERE id = transcript_id));

CREATE POLICY "Users can delete their own briefs" 
ON public.briefs 
FOR DELETE 
USING (auth.uid() = (SELECT user_id FROM public.transcripts WHERE id = transcript_id));

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_transcripts_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_briefs_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_transcripts_updated_at ON public.transcripts;
CREATE TRIGGER update_transcripts_updated_at
BEFORE UPDATE ON public.transcripts
FOR EACH ROW
EXECUTE FUNCTION public.update_transcripts_updated_at();

DROP TRIGGER IF EXISTS update_briefs_updated_at ON public.briefs;
CREATE TRIGGER update_briefs_updated_at
BEFORE UPDATE ON public.briefs
FOR EACH ROW
EXECUTE FUNCTION public.update_briefs_updated_at();

-- Add helpful comments
COMMENT ON TABLE public.transcripts IS 'Stores transcribed text from audio files';
COMMENT ON TABLE public.briefs IS 'Stores AI-generated briefs based on transcripts';
COMMENT ON COLUMN public.transcripts.user_id IS 'UUID of the user who owns this transcript';
COMMENT ON COLUMN public.briefs.transcript_id IS 'Foreign key to the source transcript';
COMMENT ON COLUMN public.briefs.template IS 'Template type used for brief generation';
COMMENT ON COLUMN public.briefs.content_md IS 'Markdown content of the generated brief'; 