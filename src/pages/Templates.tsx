import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Info } from 'lucide-react';
import { useTemplates } from '@/contexts/TemplatesContext';
import { TemplateInfoModal } from '@/components/templates/TemplateInfoModal';
import { CreateTemplateForm } from '@/components/templates/CreateTemplateForm';
import { TemplateConfig } from '@/types/templates';

export function Templates() {
  const { templates } = useTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleTemplateClick = (template: TemplateConfig) => {
    setSelectedTemplate(template);
    setShowInfoModal(true);
  };

  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Brief Templates</h1>
          <p className="text-muted-foreground">Browse and manage templates for generating professional briefs.</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Custom Template
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className="group relative flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => handleTemplateClick(template)}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
            
            <CardHeader className="relative">
              <div className="flex items-start justify-between">
                <span className="text-3xl mb-3">{template.icon}</span>
                {template.id.startsWith('custom_') && (
                  <Badge variant="secondary" className="text-xs">Custom</Badge>
                )}
              </div>
              <CardTitle className="text-xl">{template.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {template.description}
              </CardDescription>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="relative">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Click for details
                </span>
                <span className="text-xs">
                  {template.outputStructure.length} sections
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create Custom Template Card */}
        <Card 
          className="group relative flex flex-col items-center justify-center border-2 border-dashed text-center p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary"
          onClick={() => setShowCreateForm(true)}
        >
          <div className="space-y-4">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-max group-hover:bg-primary/20 transition-colors">
              <PlusCircle className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-xl">Create Custom Template</CardTitle>
              <CardDescription>
                Design a template tailored to your specific needs
              </CardDescription>
            </div>
          </div>
        </Card>
      </div>

      {/* Template Info Modal */}
      <TemplateInfoModal
        template={selectedTemplate}
        isOpen={showInfoModal}
        onClose={handleCloseInfoModal}
      />

      {/* Create Template Form */}
      <CreateTemplateForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
      />
    </div>
  );
} 