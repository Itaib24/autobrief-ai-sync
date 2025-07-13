import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AudioFile } from '@/types/audio';
import { 
  Zap, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Clock,
  FileAudio
} from 'lucide-react';

interface RealTimeProgressProps {
  files: AudioFile[];
  uploadProgress: { [key: string]: number };
  processingStates: { [key: string]: string };
}

export function RealTimeProgress({ 
  files, 
  uploadProgress, 
  processingStates 
}: RealTimeProgressProps) {
  const processingFiles = files.filter(file => 
    uploadProgress[file.id] !== undefined && uploadProgress[file.id] < 100
  );

  const completedFiles = files.filter(file => 
    file.uploadStatus === 'completed'
  );

  const errorFiles = files.filter(file => 
    file.uploadStatus === 'error'
  );

  const totalProgress = files.length > 0 
    ? files.reduce((sum, file) => sum + (uploadProgress[file.id] || (file.uploadStatus === 'completed' ? 100 : 0)), 0) / files.length
    : 0;

  if (processingFiles.length === 0 && completedFiles.length === 0 && errorFiles.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Overall Progress Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Zap className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  Processing Audio Files
                </h4>
                <p className="text-sm text-muted-foreground">
                  {processingFiles.length > 0 ? `${processingFiles.length} files processing...` : 'All files processed'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {Math.round(totalProgress)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Complete
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={totalProgress} 
              className="h-3 bg-white/50"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {completedFiles.length} of {files.length} files completed
              </span>
              <span>
                {errorFiles.length > 0 && `${errorFiles.length} error${errorFiles.length !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* Individual File Progress */}
          {processingFiles.length > 0 && (
            <div className="space-y-3 mt-6">
              <h5 className="font-medium text-foreground text-sm flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Current Processing
              </h5>
              
              <div className="space-y-2">
                {processingFiles.map((file) => (
                  <div key={file.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground truncate max-w-[200px]" title={file.name}>
                        {file.name}
                      </span>
                      <span className="text-primary font-semibold">
                        {Math.round(uploadProgress[file.id] || 0)}%
                      </span>
                    </div>
                    <Progress 
                      value={uploadProgress[file.id] || 0} 
                      className="h-2 bg-white/30"
                    />
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {processingStates[file.id] || 'Processing...'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Summary */}
          {(completedFiles.length > 0 || errorFiles.length > 0) && (
            <div className="flex items-center gap-6 pt-4 border-t border-primary/20">
              {completedFiles.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-700 font-medium">
                    {completedFiles.length} completed
                  </span>
                </div>
              )}
              
              {errorFiles.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-destructive font-medium">
                    {errorFiles.length} failed
                  </span>
                </div>
              )}

              {processingFiles.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <FileAudio className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-primary font-medium">
                    {processingFiles.length} processing
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}