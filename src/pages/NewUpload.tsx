import { useState } from 'react';
import EnhancedAudioProcessorV2 from '@/components/workflow/EnhancedAudioProcessorV2';
import EnhancedResultsDisplay from '@/components/audio/EnhancedResultsDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface ProcessingResult {
  transcription: string;
  brief: string;
  summary: string;
  templateType: string;
  metadata: any;
  briefId?: string;
}

export default function NewUploadPage() {
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const handleProcessingComplete = (processingResult: ProcessingResult) => {
    setResult(processingResult);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          AutoBrief.AI - Complete Audio Workflow
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload audio, get professional briefs with enhanced transcription and AI generation.
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Audio Upload
          </TabsTrigger>
          <TabsTrigger value="result" className="flex items-center gap-2" disabled={!result}>
            <FileText className="h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-8">
          <EnhancedAudioProcessorV2 onComplete={handleProcessingComplete} />
        </TabsContent>

        <TabsContent value="result" className="mt-8">
          {result ? (
            <EnhancedResultsDisplay
              transcript={result.transcription}
              generatedBrief={result.brief}
              generatedSummary={result.summary}
              selectedTemplate={result.templateType as any}
              processingStats={{
                totalTime: 45000,
                transcriptionTime: 30000,
                briefGenerationTime: 15000,
                qualityScore: result.metadata?.qualityScore || 85,
                wordCount: result.brief.split(' ').length + result.summary.split(' ').length,
                confidence: result.metadata?.transcription?.averageConfidence || 90
              }}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
                <p className="text-gray-600">
                  Upload and process an audio file to see results here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Setup Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">🔧 Required Configuration</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Google Speech-to-Text API key in Supabase secrets</li>
                <li>• Google Gemini API key in Supabase secrets</li>
                <li>• Both APIs enabled in Google Cloud Console</li>
                <li>• Billing enabled in Google Cloud</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">📝 Usage Tips</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Use clear audio with minimal background noise</li>
                <li>• MP3 format works best for compatibility</li>
                <li>• Files under 10 minutes process faster</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}