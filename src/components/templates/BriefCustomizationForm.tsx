import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BriefCustomization } from '@/types/templates';
import { TemplateConfig } from '@/types/templates';
import { 
  Settings, 
  Palette, 
  FileText, 
  Target,
  Building,
  Info
} from 'lucide-react';

interface BriefCustomizationFormProps {
  template: TemplateConfig;
  customizations: Partial<BriefCustomization>;
  onCustomizationsChange: (customizations: Partial<BriefCustomization>) => void;
  disabled?: boolean;
}

export function BriefCustomizationForm({ 
  template, 
  customizations, 
  onCustomizationsChange, 
  disabled = false 
}: BriefCustomizationFormProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const updateCustomization = <K extends keyof BriefCustomization>(
    key: K, 
    value: BriefCustomization[K]
  ) => {
    onCustomizationsChange({ ...customizations, [key]: value });
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Brief Customization
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {template.category}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {template.name} Template
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Customizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tone Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Tone & Style
            </label>
            <Select
              value={customizations.tone || 'professional'}
              onValueChange={(value) => updateCustomization('tone', value as any)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {template.customizations.tone.map((tone) => (
                  <SelectItem key={tone} value={tone}>
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Length Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Detail Level
            </label>
            <Select
              value={customizations.length || 'detailed'}
              onValueChange={(value) => updateCustomization('length', value as any)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                {template.customizations.length.map((length) => (
                  <SelectItem key={length} value={length}>
                    {length.charAt(0).toUpperCase() + length.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Target className="w-4 h-4" />
            Focus Areas
          </label>
          <div className="flex flex-wrap gap-2">
            {template.customizations.focus_areas.map((area) => {
              const isSelected = customizations.focusAreas?.includes(area) || false;
              return (
                <Button
                  key={area}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const currentAreas = customizations.focusAreas || [];
                    const newAreas = isSelected
                      ? currentAreas.filter(a => a !== area)
                      : [...currentAreas, area];
                    updateCustomization('focusAreas', newAreas);
                  }}
                  disabled={disabled}
                  className="text-xs"
                >
                  {area.replace('_', ' ')}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Include Timestamps</span>
              <p className="text-xs text-muted-foreground">Add time markers for reference</p>
            </div>
            <Switch
              checked={customizations.includeTimestamps || false}
              onCheckedChange={(checked) => updateCustomization('includeTimestamps', checked)}
              disabled={disabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Speaker Names</span>
              <p className="text-xs text-muted-foreground">Identify speakers in the content</p>
            </div>
            <Switch
              checked={customizations.includeSpeakerNames ?? true}
              onCheckedChange={(checked) => updateCustomization('includeSpeakerNames', checked)}
              disabled={disabled}
            />
          </div>
        </div>

        {/* Advanced Settings Toggle */}
        <Button
          variant="outline"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="w-full"
          disabled={disabled}
        >
          {isAdvancedOpen ? 'Hide' : 'Show'} Advanced Settings
        </Button>

        {/* Advanced Settings */}
        {isAdvancedOpen && (
          <div className="space-y-4 border-t border-border pt-4">
            {/* Output Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Output Format</label>
              <Select
                value={customizations.outputFormat || 'structured'}
                onValueChange={(value) => updateCustomization('outputFormat', value as any)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="structured">Structured (Headers & Sections)</SelectItem>
                  <SelectItem value="markdown">Markdown Format</SelectItem>
                  <SelectItem value="narrative">Narrative Style</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Company Context */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building className="w-4 h-4" />
                Company Context (Optional)
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Acme Corp"
                    value={customizations.companyContext?.name || ''}
                    onChange={(e) => updateCustomization('companyContext', {
                      ...customizations.companyContext,
                      name: e.target.value
                    })}
                    disabled={disabled}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Industry</label>
                  <input
                    type="text"
                    placeholder="e.g., Technology"
                    value={customizations.companyContext?.industry || ''}
                    onChange={(e) => updateCustomization('companyContext', {
                      ...customizations.companyContext,
                      industry: e.target.value
                    })}
                    disabled={disabled}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800 mb-1">
                <Info className="w-4 h-4" />
                <span className="font-medium text-sm">Template Info</span>
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Best for:</strong> {template.businessContext.suitable_for.join(', ')}</p>
                <p><strong>Typical duration:</strong> {template.businessContext.typical_duration}</p>
                <p><strong>Expected participants:</strong> ~{template.businessContext.expected_participants} people</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}