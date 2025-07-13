-- Fix RLS Performance Issues
-- This migration addresses the Supabase linter warnings by:
-- 1. Optimizing auth.uid() calls using (select auth.uid())
-- 2. Removing duplicate/overlapping policies
-- 3. Removing duplicate indexes
-- 4. Consolidating policies for better performance

-- =============================================================================
-- 1. DROP ALL EXISTING DUPLICATE AND OVERLAPPING POLICIES
-- =============================================================================

-- Drop duplicate transcripts policies
DROP POLICY IF EXISTS "Users can view their own transcripts" ON public.transcripts;
DROP POLICY IF EXISTS "Users can create their own transcripts" ON public.transcripts;
DROP POLICY IF EXISTS "Users can update their own transcripts" ON public.transcripts;
DROP POLICY IF EXISTS "Users can delete their own transcripts" ON public.transcripts;
DROP POLICY IF EXISTS "Users can CRUD own transcripts" ON public.transcripts;

-- Drop duplicate briefs policies
DROP POLICY IF EXISTS "Users can view their own briefs" ON public.briefs;
DROP POLICY IF EXISTS "Users can create briefs for their transcripts" ON public.briefs;
DROP POLICY IF EXISTS "Users can update their own briefs" ON public.briefs;
DROP POLICY IF EXISTS "Users can delete their own briefs" ON public.briefs;
DROP POLICY IF EXISTS "Users can CRUD own briefs" ON public.briefs;

-- Drop user_profiles policies (to recreate optimized versions)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Drop transcriptions_enhanced policies (to recreate optimized versions)
DROP POLICY IF EXISTS "Users can view their own enhanced transcriptions" ON public.transcriptions_enhanced;
DROP POLICY IF EXISTS "Users can create their own enhanced transcriptions" ON public.transcriptions_enhanced;
DROP POLICY IF EXISTS "Users can update their own enhanced transcriptions" ON public.transcriptions_enhanced;
DROP POLICY IF EXISTS "Users can delete their own enhanced transcriptions" ON public.transcriptions_enhanced;

-- =============================================================================
-- 2. REMOVE DUPLICATE INDEXES
-- =============================================================================

-- Remove duplicate index (keeping the composite one which is more useful)
DROP INDEX IF EXISTS public.idx_transcripts_user_created;

-- =============================================================================
-- 3. CREATE OPTIMIZED RLS POLICIES WITH (select auth.uid())
-- =============================================================================

-- Optimized transcripts policies (single comprehensive policy per action)
CREATE POLICY "transcripts_select_policy" 
ON public.transcripts 
FOR SELECT 
USING ((select auth.uid()) = user_id);

CREATE POLICY "transcripts_insert_policy" 
ON public.transcripts 
FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "transcripts_update_policy" 
ON public.transcripts 
FOR UPDATE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "transcripts_delete_policy" 
ON public.transcripts 
FOR DELETE 
USING ((select auth.uid()) = user_id);

-- Optimized briefs policies (single comprehensive policy per action)
CREATE POLICY "briefs_select_policy" 
ON public.briefs 
FOR SELECT 
USING ((select auth.uid()) = (SELECT user_id FROM public.transcripts WHERE id = transcript_id));

CREATE POLICY "briefs_insert_policy" 
ON public.briefs 
FOR INSERT 
WITH CHECK ((select auth.uid()) = (SELECT user_id FROM public.transcripts WHERE id = transcript_id));

CREATE POLICY "briefs_update_policy" 
ON public.briefs 
FOR UPDATE 
USING ((select auth.uid()) = (SELECT user_id FROM public.transcripts WHERE id = transcript_id));

CREATE POLICY "briefs_delete_policy" 
ON public.briefs 
FOR DELETE 
USING ((select auth.uid()) = (SELECT user_id FROM public.transcripts WHERE id = transcript_id));

-- Optimized user_profiles policies 
CREATE POLICY "user_profiles_select_policy" 
ON public.user_profiles 
FOR SELECT 
USING ((select auth.uid()) = user_id);

CREATE POLICY "user_profiles_insert_policy" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "user_profiles_update_policy" 
ON public.user_profiles 
FOR UPDATE 
USING ((select auth.uid()) = user_id);

-- Optimized transcriptions_enhanced policies
CREATE POLICY "transcriptions_enhanced_select_policy" 
ON public.transcriptions_enhanced 
FOR SELECT 
USING ((select auth.uid()) = user_id);

CREATE POLICY "transcriptions_enhanced_insert_policy" 
ON public.transcriptions_enhanced 
FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "transcriptions_enhanced_update_policy" 
ON public.transcriptions_enhanced 
FOR UPDATE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "transcriptions_enhanced_delete_policy" 
ON public.transcriptions_enhanced 
FOR DELETE 
USING ((select auth.uid()) = user_id);

-- =============================================================================
-- 4. ADD PERFORMANCE COMMENTS
-- =============================================================================

COMMENT ON POLICY "transcripts_select_policy" ON public.transcripts IS 
'Optimized RLS policy using (select auth.uid()) for better performance';

COMMENT ON POLICY "briefs_select_policy" ON public.briefs IS 
'Optimized RLS policy using (select auth.uid()) for better performance';

COMMENT ON POLICY "user_profiles_select_policy" ON public.user_profiles IS 
'Optimized RLS policy using (select auth.uid()) for better performance';

COMMENT ON POLICY "transcriptions_enhanced_select_policy" ON public.transcriptions_enhanced IS 
'Optimized RLS policy using (select auth.uid()) for better performance';

-- =============================================================================
-- 5. VERIFY RLS IS ENABLED ON ALL TABLES
-- =============================================================================

ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcriptions_enhanced ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- This migration should resolve:
-- ✅ Auth RLS Initialization Plan warnings (using select auth.uid())
-- ✅ Multiple Permissive Policies warnings (consolidated to single policies)
-- ✅ Duplicate Index warnings (removed duplicate index)
-- ✅ Improved query performance for all RLS operations 