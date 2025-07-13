-- Create user_profiles table for tracking usage and subscription data
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  briefs_count INTEGER DEFAULT 0,
  briefs_limit INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_user_profiles_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update usage count after brief creation
CREATE OR REPLACE FUNCTION public.update_user_usage_count()
RETURNS TRIGGER AS $$
DECLARE
  user_uuid UUID;
  current_month_start DATE;
  monthly_count INTEGER;
BEGIN
  -- Get user_id from the transcript
  SELECT user_id INTO user_uuid
  FROM transcripts 
  WHERE id = NEW.transcript_id;
  
  -- Calculate start of current month
  current_month_start := date_trunc('month', CURRENT_DATE);
  
  -- Count briefs for this month
  SELECT COUNT(*) INTO monthly_count
  FROM briefs b
  JOIN transcripts t ON b.transcript_id = t.id
  WHERE t.user_id = user_uuid
  AND b.created_at >= current_month_start;
  
  -- Update user profile with current count
  UPDATE user_profiles 
  SET briefs_count = monthly_count,
      updated_at = now()
  WHERE user_id = user_uuid;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update usage count when brief is created
CREATE TRIGGER update_usage_after_brief_insert
  AFTER INSERT ON public.briefs
  FOR EACH ROW EXECUTE FUNCTION public.update_user_usage_count();