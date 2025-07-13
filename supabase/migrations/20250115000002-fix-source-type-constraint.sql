-- Fix source_type check constraint issue
-- This migration removes the restrictive check constraint and allows all the source_type values used in the application

-- =============================================================================
-- 1. DROP EXISTING CHECK CONSTRAINT (if it exists)
-- =============================================================================

-- Remove the restrictive check constraint that's causing the error
ALTER TABLE public.transcripts DROP CONSTRAINT IF EXISTS transcripts_source_type_check;

-- =============================================================================
-- 2. ADD NEW FLEXIBLE CHECK CONSTRAINT
-- =============================================================================

-- Add a new check constraint that allows all the source_type values used in the application
ALTER TABLE public.transcripts 
ADD CONSTRAINT transcripts_source_type_check 
CHECK (source_type IN ('audio_upload', 'upload', 'diagnostic_test', 'manual_entry', 'api_import'));

-- =============================================================================
-- 3. UPDATE EXISTING RECORDS (if needed)
-- =============================================================================

-- Standardize any existing records that might have inconsistent values
UPDATE public.transcripts 
SET source_type = 'audio_upload' 
WHERE source_type NOT IN ('audio_upload', 'upload', 'diagnostic_test', 'manual_entry', 'api_import');

-- =============================================================================
-- 4. ADD HELPFUL COMMENTS
-- =============================================================================

COMMENT ON COLUMN public.transcripts.source_type IS 
'Source of the transcript: audio_upload (default), upload, diagnostic_test, manual_entry, or api_import';

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- This migration fixes:
-- ✅ Allows all source_type values used in the application
-- ✅ Removes the restrictive check constraint causing errors
-- ✅ Provides room for future source types
-- ✅ Maintains data integrity with proper constraints 