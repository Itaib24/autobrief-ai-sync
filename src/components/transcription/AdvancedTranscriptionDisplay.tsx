import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TranscriptionResult, TranscriptionSegment } from '@/types/transcription';
import { 
  Users, 
  Clock, 
  Volume2, 
  Star, 
  AlertTriangle,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Copy,
  Download
} from 'lucide-react';

interface AdvancedTranscriptionDisplayProps {
  result: TranscriptionResult;
  onCopy?: (text: string) => void;
  onDownload?: (result: TranscriptionResult) => void;
}

export function AdvancedTranscriptionDisplay({ 
  result, 
  onCopy, 
  onDownload 
}: AdvancedTranscriptionDisplayProps) {
  const [showSegments, setShowSegments] = useState(false);
  const [playingSegment, setPlayingSegment] = useState<string | null>(null);

  const getQualityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityText = (score: number) => {
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.8) return 'Very Good';
    if (score >= 0.7) return 'Good';
    if (score >= 0.6) return 'Fair';
    return 'Poor';
  };

  const handleCopyFullText = () => {
    onCopy?.(result.fullText);
  };

  const handleCopySegment = (segment: TranscriptionSegment) => {
    const segmentText = `[${segment.speaker}] (${segment.startTime} - ${segment.endTime}): ${segment.text}`;
    onCopy?.(segmentText);
  };

  const handlePlaySegment = (segmentId: string) => {
    if (playingSegment === segmentId) {
      setPlayingSegment(null);
    } else {
      setPlayingSegment(segmentId);
      // Note: Actual audio playback would need integration with audio player
    }
  };

  return (
    <div className="space-y-6">
      {/* Quality Overview */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            Transcription Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quality Score */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Quality Score</span>
            <div className="flex items-center gap-2">
              <Star className={`w-4 h-4 ${getQualityColor(result.qualityScore)}`} />
              <span className={`font-semibold ${getQualityColor(result.qualityScore)}`}>
                {Math.round(result.qualityScore * 100)}% ({getQualityText(result.qualityScore)})
              </span>
            </div>
          </div>
          
          <Progress value={result.qualityScore * 100} className="h-2" />

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Duration</span>
              <div className="font-medium">{result.metadata.duration}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Words</span>
              <div className="font-medium">{result.metadata.wordCount.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Speakers</span>
              <div className="font-medium flex items-center gap-1">
                <Users className="w-3 h-3" />
                {result.metadata.speakerCount}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Confidence</span>
              <div className="font-medium">{Math.round(result.metadata.averageConfidence * 100)}%</div>
            </div>
          </div>

          {/* Processing Info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Processed in {(result.metadata.processingTime / 1000).toFixed(1)}s
            </span>
            <span>Language: {result.metadata.languageDetected}</span>
          </div>

          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-800 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Quality Warnings</span>
              </div>
              <ul className="text-sm text-amber-700 space-y-1">
                {result.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyFullText}
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Text
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload?.(result)}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            {result.segments.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSegments(!showSegments)}
                className="gap-2"
              >
                {showSegments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showSegments ? 'Hide' : 'Show'} Segments ({result.segments.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Full Transcript */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Full Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {result.fullText}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Speaker Segments */}
      {showSegments && result.segments.length > 1 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Speaker Segments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.segments.map((segment, index) => (
              <div 
                key={index}
                className="border border-border rounded-lg p-4 space-y-2 hover:bg-muted/30 transition-colors"
              >
                {/* Segment Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      {segment.speaker}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {segment.startTime} - {segment.endTime}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(segment.confidence * 100)}% confidence
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePlaySegment(`${index}`)}
                      className="h-6 w-6 p-0"
                    >
                      {playingSegment === `${index}` ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopySegment(segment)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Segment Text */}
                <p className="text-sm text-foreground leading-relaxed">
                  {segment.text}
                </p>

                {/* Word-level confidence (if available) */}
                {segment.words && segment.words.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Word confidence: {segment.words.map(w => Math.round((w.confidence || 0.9) * 100)).join('%, ')}%
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}