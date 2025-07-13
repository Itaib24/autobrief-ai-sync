-- Add metadata and quality tracking columns to briefs table
ALTER TABLE public.briefs ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE public.briefs ADD COLUMN IF NOT EXISTS quality_score FLOAT DEFAULT 0;
ALTER TABLE public.briefs ADD COLUMN IF NOT EXISTS processing_time_ms INTEGER DEFAULT 0;

-- Add metadata column to transcripts table for storing transcription details
ALTER TABLE public.transcripts ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_briefs_template ON public.briefs(template);
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON public.briefs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_briefs_quality_score ON public.briefs(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_transcripts_user_id_created_at ON public.transcripts(user_id, created_at DESC);

-- Add helpful comments
COMMENT ON COLUMN public.briefs.metadata IS 'JSON metadata including transcription details, generation settings, and quality metrics';
COMMENT ON COLUMN public.briefs.quality_score IS 'Quality score between 0.0 and 1.0 indicating brief generation quality';
COMMENT ON COLUMN public.briefs.processing_time_ms IS 'Total processing time in milliseconds for the complete workflow';
COMMENT ON COLUMN public.transcripts.metadata IS 'JSON metadata including audio format, duration, speaker count, and confidence scores';