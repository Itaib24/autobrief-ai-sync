import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Sparkles,
  Copy,
  Download,
  Edit3,
  Save,
  X,
  CheckCircle,
  Mic,
  Bot,
  Eye,
  Zap
} from 'lucide-react';
import { TEMPLATES } from '@/constants/templates';
import { TemplateType } from '@/types';

interface LiveBriefDisplayProps {
  transcript: string;
  generatedBrief: string;
  selectedTemplate: TemplateType;
  onSaveBrief?: (editedBrief: string) => Promise<void>;
}

export function LiveBriefDisplay({ 
  transcript, 
  generatedBrief, 
  selectedTemplate,
  onSaveBrief 
}: LiveBriefDisplayProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBrief, setEditedBrief] = useState(generatedBrief);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('both');

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: `Failed to copy ${label.toLowerCase()}.`,
        variant: "destructive",
      });
    }
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveBrief = async () => {
    if (!onSaveBrief) return;
    
    setIsSaving(true);
    try {
      await onSaveBrief(editedBrief);
      setIsEditing(false);
      toast({
        title: "✅ Changes Saved",
        description: "Your brief has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getTemplateName = () => {
    return TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Brief';
  };

  const wordCount = transcript.split(' ').length;
  const briefWordCount = generatedBrief.split(' ').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Header */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-900/30 border-green-200 shadow-xl">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-bounce-gentle">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-bold text-green-800 dark:text-green-200">
                  🎉 Live Brief Ready!
                </h2>
                <p className="text-green-700 dark:text-green-300 text-lg">
                  Your audio has been transformed into a professional {getTemplateName().toLowerCase()}
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Badge variant="outline" className="px-4 py-2 text-lg bg-white/50">
                <Mic className="w-5 h-5 mr-2 text-primary" />
                {wordCount} words transcribed
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg bg-white/50">
                <Bot className="w-5 h-5 mr-2 text-primary" />
                {briefWordCount} word brief generated
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg bg-white/50">
                <Zap className="w-5 h-5 mr-2 text-primary" />
                {getTemplateName()} format
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content Display */}
      <Card className="shadow-xl border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-white/50">
                <TabsTrigger value="both" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Both</span>
                </TabsTrigger>
                <TabsTrigger value="transcript" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Transcript</span>
                </TabsTrigger>
                <TabsTrigger value="brief" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">AI Brief</span>
                </TabsTrigger>
              </TabsList>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                {activeTab === 'brief' && !isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                
                {activeTab === 'brief' && isEditing && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditedBrief(generatedBrief);
                        setIsEditing(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveBrief}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const content = activeTab === 'transcript' ? transcript : 
                                  activeTab === 'brief' ? generatedBrief : 
                                  `TRANSCRIPT:\n\n${transcript}\n\n---\n\nAI BRIEF:\n\n${generatedBrief}`;
                    copyToClipboard(content, activeTab === 'both' ? 'Content' : activeTab === 'transcript' ? 'Transcript' : 'Brief');
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const content = activeTab === 'transcript' ? transcript : 
                                  activeTab === 'brief' ? generatedBrief : 
                                  `TRANSCRIPT:\n\n${transcript}\n\n---\n\nAI BRIEF:\n\n${generatedBrief}`;
                    const filename = activeTab === 'transcript' ? `transcript-${Date.now()}.txt` :
                                   activeTab === 'brief' ? `brief-${selectedTemplate}-${Date.now()}.txt` :
                                   `complete-brief-${selectedTemplate}-${Date.now()}.txt`;
                    downloadAsFile(content, filename);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <TabsContent value="both" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Original Transcript */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Mic className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Original Transcript</h3>
                      <p className="text-sm text-muted-foreground">From your audio recording</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 rounded-xl p-6 border border-blue-200/50 max-h-96 overflow-y-auto">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                      {transcript}
                    </p>
                  </div>
                </div>

                {/* AI Generated Brief */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">AI Generated Brief</h3>
                      <p className="text-sm text-muted-foreground">{getTemplateName()} format</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20 max-h-96 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans leading-relaxed text-foreground text-sm">
                        {generatedBrief}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transcript" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Complete Transcript</h3>
                    <p className="text-muted-foreground">Transcribed from your audio using Google Speech-to-Text AI</p>
                    <Badge variant="outline" className="mt-1">
                      {wordCount} words
                    </Badge>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 rounded-xl p-8 border border-blue-200/50">
                  <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground">
                    {transcript}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="brief" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">AI Generated {getTemplateName()}</h3>
                    <p className="text-muted-foreground">Professional brief created by Google Gemini AI</p>
                    <Badge className="bg-primary text-primary-foreground mt-1">
                      {briefWordCount} words • {getTemplateName()}
                    </Badge>
                  </div>
                </div>
                
                {isEditing ? (
                  <Textarea
                    value={editedBrief}
                    onChange={(e) => setEditedBrief(e.target.value)}
                    className="min-h-96 resize-none font-mono text-sm"
                    placeholder="Edit your brief content..."
                  />
                ) : (
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-8 border border-primary/20">
                    <div className="prose prose-base max-w-none">
                      <pre className="whitespace-pre-wrap font-sans leading-relaxed text-foreground">
                        {generatedBrief}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}