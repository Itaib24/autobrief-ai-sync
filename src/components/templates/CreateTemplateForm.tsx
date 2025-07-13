import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTemplates } from '@/contexts/TemplatesContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, GripVertical } from 'lucide-react';

interface CreateTemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTemplateForm({ isOpen, onClose }: CreateTemplateFormProps) {
  const { addCustomTemplate } = useTemplates();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📄',
    category: 'Custom',
    gradient: 'from-indigo-500 to-purple-500',
    promptInstructions: '',
    outputStructure: [''],
    contextualPrompts: {
      speaker_analysis: true,
      sentiment_analysis: false,
      entity_extraction: true,
      action_items: true,
      timeline_extraction: false,
    },
    customizations: {
      tone: ['professional'],
      length: ['detailed'],
      focus_areas: [''],
    },
    businessContext: {
      suitable_for: [''],
      typical_duration: '30-60 minutes',
      expected_participants: 4,
    },
  });

  const availableIcons = ['📄', '📊', '💼', '🎯', '🚀', '💡', '📈', '🔧', '🎨', '🌟'];
  const availableGradients = [
    'from-indigo-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500',
    'from-amber-500 to-yellow-500',
  ];

  const handleArrayFieldChange = (field: string, index: number, value: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = field.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]][index] = value;
      return newData;
    });
  };

  const addArrayField = (field: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = field.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]].push('');
      return newData;
    });
  };

  const removeArrayField = (field: string, index: number) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = field.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]].splice(index, 1);
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description || !formData.promptInstructions) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Filter out empty strings from arrays
    const cleanedData = {
      ...formData,
      outputStructure: formData.outputStructure.filter(s => s.trim()),
      customizations: {
        ...formData.customizations,
        focus_areas: formData.customizations.focus_areas.filter(s => s.trim()),
      },
      businessContext: {
        ...formData.businessContext,
        suitable_for: formData.businessContext.suitable_for.filter(s => s.trim()),
      },
    };

    // Add the template
    addCustomTemplate(cleanedData);
    
    toast({
      title: 'Template Created',
      description: `"${formData.name}" has been successfully created.`,
    });

    // Reset form and close
    setFormData({
      name: '',
      description: '',
      icon: '📄',
      category: 'Custom',
      gradient: 'from-indigo-500 to-purple-500',
      promptInstructions: '',
      outputStructure: [''],
      contextualPrompts: {
        speaker_analysis: true,
        sentiment_analysis: false,
        entity_extraction: true,
        action_items: true,
        timeline_extraction: false,
      },
      customizations: {
        tone: ['professional'],
        length: ['detailed'],
        focus_areas: [''],
      },
      businessContext: {
        suitable_for: [''],
        typical_duration: '30-60 minutes',
        expected_participants: 4,
      },
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Custom Template</DialogTitle>
            <DialogDescription>
              Design a custom template tailored to your specific use case.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Weekly Team Standup"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Team Management"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this template is for..."
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <div className="flex gap-2 flex-wrap">
                    {availableIcons.map(icon => (
                      <Button
                        key={icon}
                        type="button"
                        variant={formData.icon === icon ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, icon }))}
                        className="text-xl w-12 h-12"
                      >
                        {icon}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <Select
                    value={formData.gradient}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gradient: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGradients.map(gradient => (
                        <SelectItem key={gradient} value={gradient}>
                          <div className={`w-full h-6 rounded bg-gradient-to-r ${gradient}`} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* AI Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI Instructions</h3>
              <div className="space-y-2">
                <Label htmlFor="promptInstructions">Prompt Instructions *</Label>
                <Textarea
                  id="promptInstructions"
                  value={formData.promptInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, promptInstructions: e.target.value }))}
                  placeholder="Provide detailed instructions for how the AI should process and generate the brief..."
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Output Structure */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Output Structure</h3>
              <p className="text-sm text-muted-foreground">
                Define the sections that should appear in the generated brief.
              </p>
              
              {formData.outputStructure.map((section, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={section}
                    onChange={(e) => handleArrayFieldChange('outputStructure', index, e.target.value)}
                    placeholder="e.g., Executive Summary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayField('outputStructure', index)}
                    disabled={formData.outputStructure.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayField('outputStructure')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>

            {/* Analysis Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Analysis Features</h3>
              <div className="space-y-3">
                {Object.entries(formData.contextualPrompts).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key} className="capitalize">
                      {key.replace(/_/g, ' ')}
                    </Label>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          contextualPrompts: { ...prev.contextualPrompts, [key]: checked }
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Business Context */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Context</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Typical Duration</Label>
                  <Input
                    id="duration"
                    value={formData.businessContext.typical_duration}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      businessContext: { ...prev.businessContext, typical_duration: e.target.value }
                    }))}
                    placeholder="e.g., 30-60 minutes"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="participants">Expected Participants</Label>
                  <Input
                    id="participants"
                    type="number"
                    value={formData.businessContext.expected_participants}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      businessContext: { ...prev.businessContext, expected_participants: parseInt(e.target.value) || 1 }
                    }))}
                    min={1}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Suitable For</Label>
                {formData.businessContext.suitable_for.map((use, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={use}
                      onChange={(e) => handleArrayFieldChange('businessContext.suitable_for', index, e.target.value)}
                      placeholder="e.g., Team meetings"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayField('businessContext.suitable_for', index)}
                      disabled={formData.businessContext.suitable_for.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('businessContext.suitable_for')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Use Case
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Template
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 