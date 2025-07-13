import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FilePlus2,
  UploadCloud, 
  Mic,
  FileText,
} from 'lucide-react';

interface EmptyDashboardProps {
  userDisplayName: string;
}

export function EmptyDashboard({ userDisplayName }: EmptyDashboardProps) {
  const features = [
    {
      icon: UploadCloud,
      title: "Upload Audio",
      description: "Supports MP3, WAV, and M4A files."
    },
    {
      icon: Mic,
      title: "Transcribe Speech",
      description: "Accurate transcription powered by AI."
    },
    {
      icon: FileText,
      title: "Generate Briefs",
      description: "Turn transcripts into formatted documents."
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4 text-center bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-3xl w-full">
        <div className="mb-8">
          <FilePlus2 className="mx-auto h-16 w-16 text-blue-500 mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Let's create your first brief, {userDisplayName}!
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            AutoBrief helps you turn messy audio into clear, actionable documents.
            Start by uploading an audio file.
          </p>
        </div>

        <div className="mb-10">
          <Link to="/app/upload">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105">
              <UploadCloud className="mr-2 h-5 w-5" />
              Upload First Audio File
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200/80 dark:border-gray-700/80 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{feature.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}