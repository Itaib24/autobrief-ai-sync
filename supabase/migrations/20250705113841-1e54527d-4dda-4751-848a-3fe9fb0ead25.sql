-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', false);

-- Create storage policies for user file uploads
CREATE POLICY "Users can upload their own files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable RLS on existing tables if not already enabled
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for transcripts
CREATE POLICY "Users can view their own transcripts" 
ON public.transcripts 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own transcripts" 
ON public.transcripts 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own transcripts" 
ON public.transcripts 
FOR UPDATE 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own transcripts" 
ON public.transcripts 
FOR DELETE 
USING (auth.uid()::text = user_id);

-- Create RLS policies for briefs
CREATE POLICY "Users can view their own briefs" 
ON public.briefs 
FOR SELECT 
USING (auth.uid()::text = (SELECT user_id FROM transcripts WHERE id = transcript_id));

CREATE POLICY "Users can create briefs for their transcripts" 
ON public.briefs 
FOR INSERT 
WITH CHECK (auth.uid()::text = (SELECT user_id FROM transcripts WHERE id = transcript_id));

CREATE POLICY "Users can update their own briefs" 
ON public.briefs 
FOR UPDATE 
USING (auth.uid()::text = (SELECT user_id FROM transcripts WHERE id = transcript_id));

CREATE POLICY "Users can delete their own briefs" 
ON public.briefs 
FOR DELETE 
USING (auth.uid()::text = (SELECT user_id FROM transcripts WHERE id = transcript_id));