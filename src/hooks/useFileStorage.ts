import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export function useFileStorage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  });

  const uploadFile = useCallback(async (
    file: File,
    workflowId: string,
    folder: string = 'audio-files'
  ): Promise<string> => {
    if (!user) {
      throw new Error('User must be authenticated to upload files');
    }

    if (!file) {
      throw new Error('No file provided');
    }

    console.log(`[${workflowId}] Starting file upload: ${file.name} (${file.size} bytes)`);

    try {
      setUploadProgress({ progress: 0, status: 'uploading' });

      // Create a unique filename with timestamp and user ID
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileExtension = file.name.split('.').pop() || 'unknown';
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${user.id}/${timestamp}_${sanitizedFileName}`;
      const filePath = `${folder}/${fileName}`;

      console.log(`[${workflowId}] Uploading to path: ${filePath}`);

      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('audio-processing')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          metadata: {
            uploadedBy: user.id,
            workflowId: workflowId,
            originalName: file.name,
            fileSize: file.size.toString(),
            contentType: file.type
          }
        });

      if (error) {
        console.error(`[${workflowId}] Upload error:`, error);
        setUploadProgress({ progress: 0, status: 'error', error: error.message });
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      console.log(`[${workflowId}] File uploaded successfully:`, data);

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('audio-processing')
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }

      setUploadProgress({ progress: 100, status: 'completed' });

      console.log(`[${workflowId}] File upload completed. Public URL: ${publicUrlData.publicUrl}`);

      toast({
        title: "File Uploaded",
        description: `${file.name} has been successfully uploaded to storage`,
      });

      return publicUrlData.publicUrl;

    } catch (error) {
      console.error(`[${workflowId}] File upload failed:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      setUploadProgress({ progress: 0, status: 'error', error: errorMessage });
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [user, toast]);

  const deleteFile = useCallback(async (filePath: string, workflowId: string): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to delete files');
    }

    try {
      console.log(`[${workflowId}] Deleting file: ${filePath}`);

      const { error } = await supabase.storage
        .from('audio-processing')
        .remove([filePath]);

      if (error) {
        console.error(`[${workflowId}] Delete error:`, error);
        throw new Error(`Failed to delete file: ${error.message}`);
      }

      console.log(`[${workflowId}] File deleted successfully: ${filePath}`);

    } catch (error) {
      console.error(`[${workflowId}] File deletion failed:`, error);
      throw error;
    }
  }, [user]);

  const getFileUrl = useCallback((filePath: string): string => {
    const { data } = supabase.storage
      .from('audio-processing')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }, []);

  const listUserFiles = useCallback(async (folder: string = 'audio-files'): Promise<any[]> => {
    if (!user) {
      throw new Error('User must be authenticated to list files');
    }

    try {
      const userFolder = `${folder}/${user.id}`;
      const { data, error } = await supabase.storage
        .from('audio-processing')
        .list(userFolder);

      if (error) {
        console.error('Error listing files:', error);
        throw new Error(`Failed to list files: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('File listing failed:', error);
      throw error;
    }
  }, [user]);

  return {
    uploadFile,
    deleteFile,
    getFileUrl,
    listUserFiles,
    uploadProgress,
    isUploading: uploadProgress.status === 'uploading'
  };
} 