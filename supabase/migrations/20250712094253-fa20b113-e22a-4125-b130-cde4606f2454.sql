-- Enhanced transcriptions table for advanced speech-to-text features
CREATE TABLE IF NOT EXISTS transcriptions_enhanced (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Audio file information
  audio_file_url TEXT,
  original_filename TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  audio_duration_seconds INTEGER,
  audio_format TEXT NOT NULL,
  
  -- Transcription content
  full_text TEXT NOT NULL,
  segments JSONB, -- Array of speaker segments with timestamps
  
  -- Metadata and quality
  word_count INTEGER NOT NULL DEFAULT 0,
  speaker_count INTEGER NOT NULL DEFAULT 1,
  average_confidence FLOAT NOT NULL DEFAULT 0.0,
  quality_score FLOAT NOT NULL DEFAULT 0.0,
  language_detected TEXT NOT NULL DEFAULT 'en-US',
  
  -- Processing information
  processing_options JSONB, -- Transcription options used
  processing_time_ms INTEGER,
  api_request_id TEXT,
  warnings JSONB, -- Array of warning messages
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processing_started_at TIMESTAMP WITH TIME ZONE,
  processing_completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE transcriptions_enhanced ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own enhanced transcriptions" 
ON transcriptions_enhanced 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enhanced transcriptions" 
ON transcriptions_enhanced 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enhanced transcriptions" 
ON transcriptions_enhanced 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own enhanced transcriptions" 
ON transcriptions_enhanced 
FOR DELETE 
USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_transcriptions_enhanced_user_id ON transcriptions_enhanced(user_id);
CREATE INDEX idx_transcriptions_enhanced_status ON transcriptions_enhanced(status);
CREATE INDEX idx_transcriptions_enhanced_created_at ON transcriptions_enhanced(created_at DESC);
CREATE INDEX idx_transcriptions_enhanced_language ON transcriptions_enhanced(language_detected);
CREATE INDEX idx_transcriptions_enhanced_quality ON transcriptions_enhanced(quality_score DESC);

-- Full text search index
CREATE INDEX idx_transcriptions_enhanced_full_text_search 
ON transcriptions_enhanced 
USING gin(to_tsvector('english', full_text));

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_transcriptions_enhanced_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_transcriptions_enhanced_updated_at
BEFORE UPDATE ON transcriptions_enhanced
FOR EACH ROW
EXECUTE FUNCTION update_transcriptions_enhanced_updated_at();

-- Function to calculate word count on insert/update
CREATE OR REPLACE FUNCTION calculate_word_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count = array_length(string_to_array(trim(NEW.full_text), ' '), 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic word count calculation
CREATE TRIGGER calculate_word_count_trigger
BEFORE INSERT OR UPDATE OF full_text ON transcriptions_enhanced
FOR EACH ROW
EXECUTE FUNCTION calculate_word_count();