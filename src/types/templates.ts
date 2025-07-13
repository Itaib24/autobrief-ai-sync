import { TemplateType } from '@/types';

export interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  category: string;
  promptInstructions: string;
  outputStructure: string[];
  contextualPrompts: {
    speaker_analysis: boolean;
    sentiment_analysis: boolean;
    entity_extraction: boolean;
    action_items: boolean;
    timeline_extraction: boolean;
  };
  customizations: {
    tone: string[];
    length: string[];
    focus_areas: string[];
  };
  businessContext: {
    suitable_for: string[];
    typical_duration: string;
    expected_participants: number;
  };
}

export interface BriefCustomization {
  tone: 'professional' | 'casual' | 'technical' | 'executive';
  length: 'brief' | 'detailed' | 'comprehensive';
  includeTimestamps: boolean;
  includeSpeakerNames: boolean;
  focusAreas: string[];
  companyContext?: {
    name?: string;
    industry?: string;
    terminology?: { [key: string]: string };
  };
  outputFormat: 'markdown' | 'structured' | 'narrative';
}

export interface AdvancedTemplateResult {
  briefId: string;
  content: string;
  metadata: {
    templateUsed: TemplateType;
    customizations: BriefCustomization;
    qualityScore: number;
    wordCount: number;
    processingTime: number;
    extractedEntities: string[];
    sentimentScore: number;
    actionItemsCount: number;
  };
  sections: {
    title: string;
    content: string;
    confidence: number;
  }[];
  suggestions: string[];
  warnings: string[];
}