-- Cleanup unused indexes and add missing foreign key indexes
-- This addresses the remaining INFO-level Supabase linter warnings

-- =============================================================================
-- 1. ADD MISSING FOREIGN KEY INDEX (if emails table exists)
-- =============================================================================

-- Add index for emails.brief_id foreign key (conditional - only if table exists)
DO $$
BEGIN
  -- Check if emails table exists and add index if needed
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'emails') THEN
    -- Create index for the foreign key to improve join performance
    CREATE INDEX IF NOT EXISTS idx_emails_brief_id ON public.emails(brief_id);
    
    -- Also ensure RLS is enabled on emails table if it exists
    ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
    
    -- Add optimized RLS policy for emails if it doesn't exist
    DROP POLICY IF EXISTS "emails_policy" ON public.emails;
    CREATE POLICY "emails_policy" 
    ON public.emails 
    FOR ALL 
    USING ((select auth.uid()) = (SELECT user_id FROM public.transcripts WHERE id = (SELECT transcript_id FROM public.briefs WHERE id = brief_id)));
    
    RAISE NOTICE 'Added index and RLS policies for emails table';
  ELSE
    RAISE NOTICE 'Emails table does not exist - skipping email index creation';
  END IF;
END $$;

-- =============================================================================
-- 2. REMOVE UNUSED INDEXES FOR BETTER PERFORMANCE
-- =============================================================================

-- Remove unused indexes on transcriptions_enhanced table
-- These were created optimistically but are not being used by queries
DROP INDEX IF EXISTS public.idx_transcriptions_enhanced_user_id;
DROP INDEX IF EXISTS public.idx_transcriptions_enhanced_status;
DROP INDEX IF EXISTS public.idx_transcriptions_enhanced_created_at;
DROP INDEX IF EXISTS public.idx_transcriptions_enhanced_language;
DROP INDEX IF EXISTS public.idx_transcriptions_enhanced_quality;
DROP INDEX IF EXISTS public.idx_transcriptions_enhanced_full_text_search;

-- Remove unused indexes on briefs table
DROP INDEX IF EXISTS public.idx_briefs_template;
DROP INDEX IF EXISTS public.idx_briefs_quality_score;

-- =============================================================================
-- 3. KEEP ONLY ESSENTIAL INDEXES
-- =============================================================================

-- Keep only the indexes that are actually being used:
-- - idx_transcripts_user_id (used by RLS policies)
-- - idx_transcripts_created_at (used for chronological queries)
-- - idx_briefs_transcript_id (used for foreign key joins)
-- - idx_briefs_created_at (used for chronological queries)
-- - idx_transcripts_user_id_created_at (composite index for user + time queries)

-- =============================================================================
-- 4. ADD PERFORMANCE COMMENTS
-- =============================================================================

COMMENT ON INDEX public.idx_transcripts_user_id IS 
'Essential index for RLS policies and user-specific queries';

COMMENT ON INDEX public.idx_transcripts_created_at IS 
'Essential index for chronological ordering of transcripts';

COMMENT ON INDEX public.idx_briefs_transcript_id IS 
'Essential index for foreign key relationship and joins';

COMMENT ON INDEX public.idx_briefs_created_at IS 
'Essential index for chronological ordering of briefs';

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- This migration addresses:
-- ✅ Unindexed foreign keys (added index for emails.brief_id if table exists)
-- ✅ Unused indexes (removed all unused indexes to improve performance)
-- ✅ Kept only essential indexes that are actively used
-- ✅ Reduced database maintenance overhead 