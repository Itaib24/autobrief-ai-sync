import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDashboard } from '@/contexts/DashboardContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Download,
  Copy,
  FileText,
  Users,
  Target,
  Clock,
  Printer,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const BriefViewSkeleton = () => (
  <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
    <Skeleton className="h-10 w-48 mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

export function BriefView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { briefs, loading } = useDashboard();
  const [brief, setBrief] = useState<any>(null);

  useEffect(() => {
    if (!loading && briefs.length > 0 && id) {
      const foundBrief = briefs.find(b => b.id === id);
      if (foundBrief) {
        setBrief(foundBrief);
      } else {
        toast({ 
          title: "Brief Not Found", 
          description: "The brief you're looking for doesn't exist.", 
          variant: "destructive" 
        });
        navigate('/app/history');
      }
    }
  }, [briefs, loading, id, navigate, toast]);

  const getTemplateInfo = (template: string) => {
    switch (template) {
      case 'meeting_summary': return { icon: Users, label: 'Meeting Summary' };
      case 'client_update': return { icon: FileText, label: 'Client Update' };
      case 'action_plan': return { icon: Target, label: 'Action Plan' };
      default: return { icon: FileText, label: 'Brief' };
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied to Clipboard", description: `${type} has been copied.` });
    }).catch(err => {
      toast({ title: "Copy Failed", description: `Could not copy ${type}.`, variant: "destructive" });
      console.error('Copy to clipboard failed:', err);
    });
  };

  const downloadAs = (format: 'md' | 'txt') => {
    if (!brief) return;
    const blob = new Blob([brief.output_text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${getTemplateInfo(brief.template_type).label.replace(' ', '_')}_${brief.id}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  if (loading || !brief) return <BriefViewSkeleton />;

  const { icon: TemplateIcon, label: templateLabel } = getTemplateInfo(brief.template_type);

  return (
    <div className="bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/app/history')} className="mb-4 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Button>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                   <TemplateIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">{templateLabel}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Generated on {format(new Date(brief.created_at), 'MMMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" onClick={() => copyToClipboard(brief.output_text, 'Brief content')}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={window.print}>
                <Printer className="h-4 w-4" />
              </Button>
              <Button onClick={() => downloadAs('md')}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg rounded-2xl dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">Generated Brief</CardTitle>
                <CardDescription>This is the AI-generated content based on your audio.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-blue dark:prose-invert max-w-none prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-headings:font-semibold prose-headings:text-gray-800 dark:prose-headings:text-gray-100 prose-strong:text-gray-800 dark:prose-strong:text-gray-100">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>{brief.output_text}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-8">
            <Card className="shadow-lg rounded-2xl dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                 <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Template</span>
                    <Badge variant="secondary">{templateLabel}</Badge>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Word Count</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{brief.output_text.split(' ').length}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Characters</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{brief.output_text.length}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg rounded-2xl dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Original Transcript</CardTitle>
                <CardDescription>The source text used for this brief.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-60 overflow-y-auto rounded-lg bg-gray-100/50 dark:bg-gray-900/50 p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {brief.input_text || "Transcript not available."}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4" 
                  onClick={() => copyToClipboard(brief.input_text || '', 'Transcript')}
                  disabled={!brief.input_text}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Transcript
                </Button>
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    </div>
  );
}