import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TemplateConfig } from '@/types/templates';
import { ENHANCED_TEMPLATES } from '@/constants/templates';

interface TemplatesContextType {
  templates: TemplateConfig[];
  customTemplates: TemplateConfig[];
  addCustomTemplate: (template: Omit<TemplateConfig, 'id'>) => void;
  updateTemplate: (id: string, template: Partial<TemplateConfig>) => void;
  deleteTemplate: (id: string) => void;
  getTemplateById: (id: string) => TemplateConfig | undefined;
}

const TemplatesContext = createContext<TemplatesContextType | undefined>(undefined);

export function TemplatesProvider({ children }: { children: ReactNode }) {
  const [customTemplates, setCustomTemplates] = useState<TemplateConfig[]>([]);

  // Load custom templates from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('customTemplates');
    if (stored) {
      try {
        setCustomTemplates(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load custom templates:', error);
      }
    }
  }, []);

  // Save custom templates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
  }, [customTemplates]);

  const addCustomTemplate = (template: Omit<TemplateConfig, 'id'>) => {
    const newTemplate: TemplateConfig = {
      ...template,
      id: `custom_${Date.now()}` as any,
    };
    setCustomTemplates(prev => [...prev, newTemplate]);
  };

  const updateTemplate = (id: string, updates: Partial<TemplateConfig>) => {
    setCustomTemplates(prev =>
      prev.map(template =>
        template.id === id ? { ...template, ...updates } : template
      )
    );
  };

  const deleteTemplate = (id: string) => {
    setCustomTemplates(prev => prev.filter(template => template.id !== id));
  };

  const getTemplateById = (id: string): TemplateConfig | undefined => {
    const allTemplates = [...ENHANCED_TEMPLATES, ...customTemplates];
    return allTemplates.find(template => template.id === id);
  };

  const value: TemplatesContextType = {
    templates: [...ENHANCED_TEMPLATES, ...customTemplates],
    customTemplates,
    addCustomTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplateById,
  };

  return (
    <TemplatesContext.Provider value={value}>
      {children}
    </TemplatesContext.Provider>
  );
}

export function useTemplates() {
  const context = useContext(TemplatesContext);
  if (!context) {
    throw new Error('useTemplates must be used within a TemplatesProvider');
  }
  return context;
} 