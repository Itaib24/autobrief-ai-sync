-- Fix security warnings by adding SET search_path = '' to all functions

-- 1. Update transcriptions_enhanced updated_at function
CREATE OR REPLACE FUNCTION public.update_transcriptions_enhanced_updated_at()
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

-- 2. Update word count calculation function
CREATE OR REPLACE FUNCTION public.calculate_word_count()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  NEW.word_count = array_length(string_to_array(trim(NEW.full_text), ' '), 1);
  RETURN NEW;
END;
$$;

-- 3. Update user profiles updated_at function
CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
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

-- 4. Update handle new user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- 5. Update user usage count function
CREATE OR REPLACE FUNCTION public.update_user_usage_count()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
DECLARE
  user_uuid UUID;
  current_month_start DATE;
  monthly_count INTEGER;
BEGIN
  -- Get user_id from the transcript
  SELECT user_id INTO user_uuid
  FROM public.transcripts 
  WHERE id = NEW.transcript_id;
  
  -- Calculate start of current month
  current_month_start := date_trunc('month', CURRENT_DATE);
  
  -- Count briefs for this month
  SELECT COUNT(*) INTO monthly_count
  FROM public.briefs b
  JOIN public.transcripts t ON b.transcript_id = t.id
  WHERE t.user_id = user_uuid
  AND b.created_at >= current_month_start;
  
  -- Update user profile with current count
  UPDATE public.user_profiles 
  SET briefs_count = monthly_count,
      updated_at = now()
  WHERE user_id = user_uuid;
  
  RETURN NEW;
END;
$$;