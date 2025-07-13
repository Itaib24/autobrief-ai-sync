import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TemplateConfig } from '@/types/templates';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  Layers, 
  CheckCircle2,
  Sparkles,
  FileText,
  Target
} from 'lucide-react';

interface TemplateInfoModalProps {
  template: TemplateConfig | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateInfoModal({ template, isOpen, onClose }: TemplateInfoModalProps) {
  const navigate = useNavigate();

  if (!template) return null;

  const handleUseTemplate = () => {
    // Navigate to upload page with template pre-selected
    navigate('/app/upload', { state: { selectedTemplate: template.id } });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{template.icon}</span>
            <div>
              <DialogTitle className="text-2xl">{template.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {template.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Category */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1">
                {template.category}
              </Badge>
            </div>

            {/* Business Context */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Business Context
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Duration: {template.businessContext.typical_duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Participants: ~{template.businessContext.expected_participants}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Suitable for:</p>
                <div className="flex flex-wrap gap-2">
                  {template.businessContext.suitable_for.map((use, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Output Structure */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Output Structure
              </h3>
              <ul className="space-y-2">
                {template.outputStructure.map((section, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{section}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Analysis Features
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(template.contextualPrompts).map(([key, enabled]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Customization Options */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Customization Options
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Tone Options:</p>
                  <div className="flex flex-wrap gap-2">
                    {template.customizations.tone.map((tone, index) => (
                      <Badge key={index} variant="secondary" className="text-xs capitalize">
                        {tone}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Length Options:</p>
                  <div className="flex flex-wrap gap-2">
                    {template.customizations.length.map((length, index) => (
                      <Badge key={index} variant="secondary" className="text-xs capitalize">
                        {length}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Focus Areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {template.customizations.focus_areas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="text-xs capitalize">
                        {area.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleUseTemplate}>
            Use This Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 