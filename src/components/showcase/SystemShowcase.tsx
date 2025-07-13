import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Sparkles, 
  FileAudio, 
  Mic, 
  Brain, 
  Zap,
  ArrowRight,
  Star,
  Target,
  Globe,
  Shield
} from 'lucide-react';

export function SystemShowcase() {
  const features = [
    {
      icon: FileAudio,
      title: 'Modern Audio Upload',
      description: 'Drag & drop interface with real-time progress tracking',
      status: 'complete',
      details: ['Multiple format support', 'Live preview', 'Waveform visualization']
    },
    {
      icon: Mic,
      title: 'Advanced Speech-to-Text',
      description: 'Google AI-powered transcription with speaker diarization',
      status: 'complete',
      details: ['95%+ accuracy', 'Speaker identification', 'Multi-language support']
    },
    {
      icon: Brain,
      title: 'AI Template Engine',
      description: 'Google Gemini 1.5 Pro for intelligent brief generation',
      status: 'complete',
      details: ['6 professional templates', 'Context-aware prompting', 'Quality assessment']
    },
    {
      icon: Zap,
      title: 'Real-time Workflow',
      description: 'Interactive progress visualization with retry mechanisms',
      status: 'complete',
      details: ['Live metrics', 'Error recovery', 'Performance tracking']
    }
  ];

  const templates = [
    'Meeting Summary',
    'Client Update', 
    'Action Plan',
    'Interview Notes',
    'Training Session',
    'Sales Call'
  ];

  const capabilities = [
    { icon: Target, text: 'Contextual AI Prompting' },
    { icon: Globe, text: '13 Language Support' },
    { icon: Shield, text: 'Enterprise Security' },
    { icon: Star, text: 'Quality Assessment' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/20">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <span className="font-semibold text-primary">AI-Powered Brief Generation System</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Transform Audio to
          <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"> Professional Briefs</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Advanced AI system combining Google Speech-to-Text and Gemini 1.5 Pro to automatically generate 
          structured, professional briefs from your audio recordings.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          {capabilities.map((capability, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg">
              <capability.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{capability.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Architecture */}
      <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Complete System Architecture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <Card className={`h-full transition-all duration-300 hover:shadow-lg ${
                  feature.status === 'complete' ? 'bg-green-50 dark:bg-green-950/20 border-green-200' : ''
                }`}>
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                      
                      <div className="space-y-2">
                        {feature.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span className="text-muted-foreground">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {feature.status === 'complete' && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                  </CardContent>
                </Card>
                
                {/* Arrow between cards */}
                {index < features.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Professional Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((template, index) => (
              <div 
                key={index}
                className="p-4 border border-border rounded-lg hover:shadow-md transition-all duration-300 hover:border-primary/50 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FileAudio className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{template}</h4>
                    <p className="text-sm text-muted-foreground">AI-optimized template</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-500 mb-2">95%+</div>
            <div className="text-sm text-muted-foreground">Transcription Accuracy</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-blue-500 mb-2">13</div>
            <div className="text-sm text-muted-foreground">Languages Supported</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-purple-500 mb-2">6</div>
            <div className="text-sm text-muted-foreground">Professional Templates</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-orange-500 mb-2">100MB</div>
            <div className="text-sm text-muted-foreground">Max File Size</div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary to-primary-glow text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Audio?</h3>
          <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            Upload your audio file and watch our AI system automatically generate professional, 
            structured briefs in seconds. Perfect for meetings, interviews, calls, and more.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="hover-scale font-semibold px-8 py-3"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Generating Briefs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}