export interface Brief {
  id: string;
  user_id: string;
  title: string;
  input_text: string;
  output_text: string;
  template_type: 'meeting_summary' | 'client_update' | 'action_plan';
  metadata: {
    participants?: string[];
    project?: string;
    wordCount: number;
    processingTime?: number;
  };
  tags: string[];
  created_at: string;
  updated_at: string;
  shared_link?: string;
  export_count: number;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  subscription_tier: 'free' | 'pro' | 'team';
  created_at: string;
  settings: {
    defaultTemplate: string;
    emailNotifications: boolean;
    theme: 'light' | 'dark';
  };
}

export interface UsageLog {
  id: string;
  user_id: string;
  action_type: 'brief_generated' | 'export_pdf' | 'export_email' | 'brief_shared';
  timestamp: string;
  metadata: Record<string, any>;
}

export type TemplateType = 'meeting_summary' | 'client_update' | 'action_plan';