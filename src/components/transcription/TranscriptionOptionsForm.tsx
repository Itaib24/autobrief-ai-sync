import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { TranscriptionOptions } from '@/types/transcription';
import { 
  Settings, 
  Users, 
  Globe, 
  Shield, 
  Zap,
  Info
} from 'lucide-react';

interface TranscriptionOptionsFormProps {
  options: Partial<TranscriptionOptions>;
  onOptionsChange: (options: Partial<TranscriptionOptions>) => void;
  disabled?: boolean;
}

export function TranscriptionOptionsForm({ 
  options, 
  onOptionsChange, 
  disabled = false 
}: TranscriptionOptionsFormProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const updateOption = <K extends keyof TranscriptionOptions>(
    key: K, 
    value: TranscriptionOptions[K]
  ) => {
    onOptionsChange({ ...options, [key]: value });
  };

  const languageOptions = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'en-AU', label: 'English (Australia)' },
    { value: 'es-ES', label: 'Spanish (Spain)' },
    { value: 'es-US', label: 'Spanish (US)' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'pt-BR', label: 'Portuguese (Brazil)' },
    { value: 'pt-PT', label: 'Portuguese (Portugal)' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ko-KR', label: 'Korean' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' },
  ];

  const modelOptions = [
    { value: 'latest_long', label: 'Latest Long (Recommended)' },
    { value: 'latest_short', label: 'Latest Short (Fast)' },
    { value: 'phone_call', label: 'Phone Call' },
    { value: 'video', label: 'Video' },
    { value: 'default', label: 'Default' },
  ];

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Transcription Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Primary Language
            </label>
            <Select
              value={options.languageCode || 'en-US'}
              onValueChange={(value) => updateOption('languageCode', value)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Processing Model
            </label>
            <Select
              value={options.model || 'latest_long'}
              onValueChange={(value) => updateOption('model', value as any)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Speaker Diarization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Speaker Diarization</span>
            </div>
            <Switch
              checked={options.enableSpeakerDiarization || false}
              onCheckedChange={(checked) => updateOption('enableSpeakerDiarization', checked)}
              disabled={disabled}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Identify and separate different speakers in the audio
          </p>

          {/* Speaker Count Settings */}
          {options.enableSpeakerDiarization && (
            <div className="grid grid-cols-2 gap-4 ml-6">
              <div className="space-y-2">
                <label className="text-xs font-medium">Min Speakers: {options.minSpeakerCount || 1}</label>
                <Slider
                  value={[options.minSpeakerCount || 1]}
                  onValueChange={(value) => updateOption('minSpeakerCount', value[0])}
                  min={1}
                  max={6}
                  step={1}
                  disabled={disabled}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Max Speakers: {options.maxSpeakerCount || 6}</label>
                <Slider
                  value={[options.maxSpeakerCount || 6]}
                  onValueChange={(value) => updateOption('maxSpeakerCount', value[0])}
                  min={1}
                  max={10}
                  step={1}
                  disabled={disabled}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Basic Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Automatic Punctuation</span>
              <p className="text-xs text-muted-foreground">Add punctuation and capitalization</p>
            </div>
            <Switch
              checked={options.enableAutomaticPunctuation ?? true}
              onCheckedChange={(checked) => updateOption('enableAutomaticPunctuation', checked)}
              disabled={disabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Word Timestamps</span>
              <p className="text-xs text-muted-foreground">Include timing for each word</p>
            </div>
            <Switch
              checked={options.enableWordTimeOffsets ?? true}
              onCheckedChange={(checked) => updateOption('enableWordTimeOffsets', checked)}
              disabled={disabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Profanity Filter</span>
              <p className="text-xs text-muted-foreground ml-2">Remove inappropriate language</p>
            </div>
            <Switch
              checked={options.enableProfanityFilter || false}
              onCheckedChange={(checked) => updateOption('enableProfanityFilter', checked)}
              disabled={disabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Enhanced Processing</span>
              <p className="text-xs text-muted-foreground">Use advanced AI models for better accuracy</p>
            </div>
            <Switch
              checked={options.useEnhanced ?? true}
              onCheckedChange={(checked) => updateOption('useEnhanced', checked)}
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Alternative Languages</label>
              <p className="text-xs text-muted-foreground">
                Additional languages for automatic detection (max 3)
              </p>
              {/* Add multi-select for alternative languages here */}
              <div className="text-xs text-muted-foreground">
                Currently supporting automatic English variants
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800 mb-1">
                <Info className="w-4 h-4" />
                <span className="font-medium text-sm">Processing Tips</span>
              </div>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Speaker diarization works best with 2-6 speakers</li>
                <li>• Enhanced processing provides better accuracy but takes longer</li>
                <li>• Word timestamps enable precise segment editing</li>
                <li>• Phone call model optimized for low-quality audio</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}