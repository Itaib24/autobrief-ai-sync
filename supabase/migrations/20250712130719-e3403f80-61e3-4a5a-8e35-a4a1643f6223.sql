-- Create storage bucket for temporary audio files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio-processing', 'audio-processing', true);

-- Create policy for audio processing bucket - allow all operations for authenticated users
CREATE POLICY "Allow all operations for audio processing" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'audio-processing');

-- Allow public read access for Google Speech API
CREATE POLICY "Allow public read for audio processing" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'audio-processing');