import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/contexts/DashboardContext';
import { BriefGenerationWorkflow } from '@/components/workflow/BriefGenerationWorkflow';
import { TemplateType } from '@/types';
import { TEMPLATES } from '@/constants/templates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowLeft, FileUp, Sparkles, Clock, Users, Target, MessageSquare, BookOpen, Briefcase, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Upload() {
  const navigate = useNavigate();
  const { refreshData } = useDashboard();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<TemplateType | null>(null);

  const handleBriefComplete = async (briefId: string) => {
    // Refresh dashboard data to sync all components
    await refreshData();
    navigate(`/app/briefs/${briefId}`);
  };

  const resetTemplate = () => {
    setSelectedTemplate(null);
    setHoveredTemplate(null);
  };

  // Enhanced template data with icons and features
  const enhancedTemplates = TEMPLATES.map(template => {
    const templateEnhancements = {
      meeting_summary: {
        icon: Users,
        color: 'blue',
        estimatedTime: '2-3 min',
        features: ['Action items', 'Key decisions', 'Attendee tracking'],
        popularity: 95,
        badge: 'Most Popular'
      },
      client_update: {
        icon: MessageSquare,
        color: 'green',
        estimatedTime: '2-4 min',
        features: ['Professional tone', 'Progress highlights', 'Next steps'],
        popularity: 88,
        badge: 'Professional'
      },
      action_plan: {
        icon: Target,
        color: 'orange',
        estimatedTime: '3-5 min',
        features: ['Task breakdown', 'Deadlines', 'Responsibility matrix'],
        popularity: 82,
        badge: 'Structured'
      },
      interview_notes: {
        icon: BookOpen,
        color: 'purple',
        estimatedTime: '3-4 min',
        features: ['Candidate insights', 'Key responses', 'Evaluation criteria'],
        popularity: 75,
        badge: 'Detailed'
      },
      training_session: {
        icon: Sparkles,
        color: 'pink',
        estimatedTime: '4-6 min',
        features: ['Learning objectives', 'Key concepts', 'Follow-up actions'],
        popularity: 70,
        badge: 'Educational'
      },
      sales_call: {
        icon: Briefcase,
        color: 'indigo',
        estimatedTime: '2-3 min',
        features: ['Prospect insights', 'Pain points', 'Next steps'],
        popularity: 85,
        badge: 'Sales Focused'
      }
    };

    return {
      ...template,
      ...templateEnhancements[template.id as keyof typeof templateEnhancements]
    };
  });

  // Sort by popularity
  const sortedTemplates = enhancedTemplates.sort((a, b) => b.popularity - a.popularity);

  const getTemplateColorClasses = (color: string, isSelected: boolean, isHovered: boolean) => {
    const colors = {
      blue: {
        border: isSelected ? 'border-blue-500' : isHovered ? 'border-blue-300' : 'border-gray-200 dark:border-gray-700',
        bg: isSelected ? 'bg-blue-50 dark:bg-blue-950/30' : isHovered ? 'bg-blue-25 dark:bg-blue-950/20' : 'bg-white dark:bg-gray-800',
        icon: 'text-blue-500',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
        button: 'bg-blue-500 hover:bg-blue-600 text-white'
      },
      green: {
        border: isSelected ? 'border-green-500' : isHovered ? 'border-green-300' : 'border-gray-200 dark:border-gray-700',
        bg: isSelected ? 'bg-green-50 dark:bg-green-950/30' : isHovered ? 'bg-green-25 dark:bg-green-950/20' : 'bg-white dark:bg-gray-800',
        icon: 'text-green-500',
        badge: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300',
        button: 'bg-green-500 hover:bg-green-600 text-white'
      },
      orange: {
        border: isSelected ? 'border-orange-500' : isHovered ? 'border-orange-300' : 'border-gray-200 dark:border-gray-700',
        bg: isSelected ? 'bg-orange-50 dark:bg-orange-950/30' : isHovered ? 'bg-orange-25 dark:bg-orange-950/20' : 'bg-white dark:bg-gray-800',
        icon: 'text-orange-500',
        badge: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300',
        button: 'bg-orange-500 hover:bg-orange-600 text-white'
      },
      purple: {
        border: isSelected ? 'border-purple-500' : isHovered ? 'border-purple-300' : 'border-gray-200 dark:border-gray-700',
        bg: isSelected ? 'bg-purple-50 dark:bg-purple-950/30' : isHovered ? 'bg-purple-25 dark:bg-purple-950/20' : 'bg-white dark:bg-gray-800',
        icon: 'text-purple-500',
        badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
        button: 'bg-purple-500 hover:bg-purple-600 text-white'
      },
      pink: {
        border: isSelected ? 'border-pink-500' : isHovered ? 'border-pink-300' : 'border-gray-200 dark:border-gray-700',
        bg: isSelected ? 'bg-pink-50 dark:bg-pink-950/30' : isHovered ? 'bg-pink-25 dark:bg-pink-950/20' : 'bg-white dark:bg-gray-800',
        icon: 'text-pink-500',
        badge: 'bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300',
        button: 'bg-pink-500 hover:bg-pink-600 text-white'
      },
      indigo: {
        border: isSelected ? 'border-indigo-500' : isHovered ? 'border-indigo-300' : 'border-gray-200 dark:border-gray-700',
        bg: isSelected ? 'bg-indigo-50 dark:bg-indigo-950/30' : isHovered ? 'bg-indigo-25 dark:bg-indigo-950/20' : 'bg-white dark:bg-gray-800',
        icon: 'text-indigo-500',
        badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
        button: 'bg-indigo-500 hover:bg-indigo-600 text-white'
      }
    };

    return colors[color as keyof typeof colors] || colors.blue;
  };

    return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {selectedTemplate ? 'Upload Your Content' : 'Create a New Brief'}
            </h1>
            <p className="text-md text-gray-500 dark:text-gray-400 mt-1">
              {selectedTemplate
                ? `Generate a professional brief using the "${sortedTemplates.find(t => t.id === selectedTemplate)?.name}" template.`
                : 'Choose a template that matches your content type for optimal results.'}
            </p>
          </div>
          
          {selectedTemplate && (
            <Button 
              variant="outline" 
              onClick={resetTemplate} 
              className="transition-all duration-200 hover:shadow-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Templates
            </Button>
          )}
        </div>

        {/* Workflow Section */}
        {selectedTemplate && (
          <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700 animate-fade-in">
            <CardContent className="p-6 lg:p-8">
              <BriefGenerationWorkflow
                selectedTemplate={selectedTemplate}
                onComplete={handleBriefComplete}
              />
            </CardContent>
          </Card>
        )}

        {/* Template Selection */}
        {!selectedTemplate && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">6</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Template Options</div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">2-6</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Minutes Processing</div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">Gemini</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Powered Analysis</div>
                </CardContent>
              </Card>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTemplates.map((template, index) => {
                const isSelected = selectedTemplate === template.id;
                const isHovered = hoveredTemplate === template.id;
                const colorClasses = getTemplateColorClasses(template.color, isSelected, isHovered);
                const Icon = template.icon;
                
                return (
            <Card 
              key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 group relative overflow-hidden",
                      colorClasses.border,
                      colorClasses.bg,
                      "animate-fade-in"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2.5 rounded-lg ${colorClasses.bg} transition-all duration-300 group-hover:scale-110`}>
                          <Icon className={`w-6 h-6 ${colorClasses.icon}`} />
                        </div>
                        
                        <div className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300",
                          isSelected 
                            ? `${colorClasses.border.replace('border-', 'border-')} bg-current text-white` 
                            : 'border-gray-300 dark:border-gray-600 group-hover:border-current'
                        )}>
                          {isSelected && <Check className="h-3 w-3" />}
                  </div>
                </div>

                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-1 group-hover:text-current transition-colors">
                        {template.name}
                      </CardTitle>
                      
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {template.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Features */}
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Key Features:</h4>
                        <ul className="space-y-1">
                          {template.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <div className={`w-1 h-1 rounded-full ${colorClasses.icon.replace('text-', 'bg-')}`} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          {template.estimatedTime}
                        </div>
                        
                        <Badge variant="outline" className={cn("text-xs", colorClasses.badge)}>
                          {template.badge}
                        </Badge>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => setSelectedTemplate(template.id)}
                        size="sm"
                        className={cn(
                          "w-full mt-3 transition-all duration-300 group-hover:scale-105",
                          colorClasses.button
                        )}
                      >
                        <FileUp className="mr-2 h-3 w-3" />
                  Select Template
                </Button>
              </CardContent>
            </Card>
                );
              })}
            </div>

            {/* Help Section */}
            <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Need help choosing?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Each template is optimized for specific content types. Choose the one that best matches your audio content for optimal results.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="outline" className="text-xs">Meeting recordings → Meeting Summary</Badge>
                  <Badge variant="outline" className="text-xs">Client calls → Client Update</Badge>
                  <Badge variant="outline" className="text-xs">Planning sessions → Action Plan</Badge>
        </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}