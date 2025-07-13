import { TemplateType } from '@/types';
import { TemplateConfig } from '@/types/templates';

export const ENHANCED_TEMPLATES: TemplateConfig[] = [
  {
    id: 'meeting_summary' as TemplateType,
    name: 'Meeting Summary',
    description: 'Comprehensive meeting documentation with decisions and action items',
    icon: '👥',
    gradient: 'from-blue-500 to-cyan-500',
    category: 'Internal Communication',
    promptInstructions: `
      Create a comprehensive meeting summary that captures all essential information.
      Focus on extracting key decisions, action items, and participant insights.
      Maintain professional tone while ensuring clarity and actionability.
    `,
    outputStructure: [
      'Meeting Overview (date, duration, participants)',
      'Key Decisions Made',
      'Action Items (person responsible, deadline, priority)',
      'Discussion Topics Summary',
      'Next Steps and Follow-up Items',
      'Outstanding Questions/Issues'
    ],
    contextualPrompts: {
      speaker_analysis: true,
      sentiment_analysis: false,
      entity_extraction: true,
      action_items: true,
      timeline_extraction: true
    },
    customizations: {
      tone: ['professional', 'executive', 'casual'],
      length: ['brief', 'detailed', 'comprehensive'],
      focus_areas: ['decisions', 'action_items', 'discussions', 'follow_ups']
    },
    businessContext: {
      suitable_for: ['Team meetings', 'Board meetings', 'Project reviews', 'Planning sessions'],
      typical_duration: '30-120 minutes',
      expected_participants: 6
    }
  },
  {
    id: 'client_update' as TemplateType,
    name: 'Client Update',
    description: 'Professional client communication with progress and next steps',
    icon: '📊',
    gradient: 'from-green-500 to-emerald-500',
    category: 'Client Communication',
    promptInstructions: `
      Create a professional client update that emphasizes progress, achievements, and value delivery.
      Focus on client-relevant information and present challenges with solutions.
      Maintain a confident, professional tone that builds trust.
    `,
    outputStructure: [
      'Project Status Overview',
      'Completed Milestones',
      'Current Progress and Metrics',
      'Upcoming Deliverables',
      'Budget and Timeline Updates',
      'Risks and Recommendations',
      'Next Client Touchpoints'
    ],
    contextualPrompts: {
      speaker_analysis: true,
      sentiment_analysis: true,
      entity_extraction: true,
      action_items: true,
      timeline_extraction: true
    },
    customizations: {
      tone: ['professional', 'technical', 'executive'],
      length: ['brief', 'detailed'],
      focus_areas: ['progress', 'milestones', 'risks', 'next_steps']
    },
    businessContext: {
      suitable_for: ['Client calls', 'Status reviews', 'Project updates', 'Progress reports'],
      typical_duration: '30-60 minutes',
      expected_participants: 4
    }
  },
  {
    id: 'action_plan' as TemplateType,
    name: 'Action Plan',
    description: 'Structured task organization with priorities and timelines',
    icon: '🎯',
    gradient: 'from-purple-500 to-violet-500',
    category: 'Project Management',
    promptInstructions: `
      Create a structured action plan that organizes tasks by priority and provides clear guidance.
      Focus on actionability, ownership, and measurable outcomes.
      Include dependencies and resource requirements where mentioned.
    `,
    outputStructure: [
      'Executive Summary',
      'Priority Action Items (High/Medium/Low)',
      'Task Assignments and Ownership',
      'Timeline and Milestones',
      'Resource Requirements',
      'Dependencies and Blockers',
      'Success Metrics and KPIs'
    ],
    contextualPrompts: {
      speaker_analysis: true,
      sentiment_analysis: false,
      entity_extraction: true,
      action_items: true,
      timeline_extraction: true
    },
    customizations: {
      tone: ['professional', 'technical'],
      length: ['detailed', 'comprehensive'],
      focus_areas: ['priorities', 'timelines', 'resources', 'dependencies']
    },
    businessContext: {
      suitable_for: ['Planning sessions', 'Project kickoffs', 'Strategy meetings', 'Problem-solving'],
      typical_duration: '45-90 minutes',
      expected_participants: 8
    }
  },
  {
    id: 'interview_notes' as TemplateType,
    name: 'Interview Notes',
    description: 'Structured interview documentation with candidate assessment',
    icon: '🤝',
    gradient: 'from-orange-500 to-red-500',
    category: 'Human Resources',
    promptInstructions: `
      Create structured interview documentation that captures candidate qualifications and fit.
      Focus on technical skills, experience, cultural fit, and specific examples provided.
      Maintain objectivity while highlighting key strengths and development areas.
    `,
    outputStructure: [
      'Candidate Profile Summary',
      'Technical Skills Assessment',
      'Experience Highlights',
      'Cultural Fit Indicators',
      'Strengths and Development Areas',
      'Interview Feedback and Recommendations',
      'Next Steps in Process'
    ],
    contextualPrompts: {
      speaker_analysis: true,
      sentiment_analysis: true,
      entity_extraction: true,
      action_items: false,
      timeline_extraction: false
    },
    customizations: {
      tone: ['professional', 'technical'],
      length: ['detailed', 'comprehensive'],
      focus_areas: ['technical_skills', 'experience', 'cultural_fit', 'recommendations']
    },
    businessContext: {
      suitable_for: ['Job interviews', 'Technical assessments', 'Panel interviews', 'Follow-up discussions'],
      typical_duration: '30-60 minutes',
      expected_participants: 3
    }
  },
  {
    id: 'training_session' as TemplateType,
    name: 'Training Session',
    description: 'Educational content summary with key learnings and actions',
    icon: '🎓',
    gradient: 'from-teal-500 to-blue-500',
    category: 'Learning & Development',
    promptInstructions: `
      Create a comprehensive training session summary that captures learning objectives and outcomes.
      Focus on key concepts, practical applications, and participant engagement.
      Include actionable takeaways and follow-up recommendations.
    `,
    outputStructure: [
      'Session Overview and Objectives',
      'Key Concepts Covered',
      'Practical Applications',
      'Q&A Summary',
      'Participant Feedback',
      'Action Items and Next Steps',
      'Additional Resources Mentioned'
    ],
    contextualPrompts: {
      speaker_analysis: true,
      sentiment_analysis: false,
      entity_extraction: true,
      action_items: true,
      timeline_extraction: false
    },
    customizations: {
      tone: ['professional', 'casual'],
      length: ['detailed', 'comprehensive'],
      focus_areas: ['concepts', 'applications', 'takeaways', 'resources']
    },
    businessContext: {
      suitable_for: ['Training workshops', 'Educational sessions', 'Skill development', 'Knowledge sharing'],
      typical_duration: '60-180 minutes',
      expected_participants: 15
    }
  },
  {
    id: 'sales_call' as TemplateType,
    name: 'Sales Call',
    description: 'Sales conversation analysis with opportunities and next steps',
    icon: '💼',
    gradient: 'from-pink-500 to-purple-500',
    category: 'Sales & Business Development',
    promptInstructions: `
      Create a comprehensive sales call summary that identifies opportunities and next steps.
      Focus on prospect needs, pain points, buying signals, and competitive landscape.
      Include specific follow-up actions and proposal recommendations.
    `,
    outputStructure: [
      'Prospect Profile and Needs',
      'Pain Points Identified',
      'Solutions Discussed',
      'Objections and Responses',
      'Buying Signals and Timeline',
      'Competitive Intelligence',
      'Follow-up Actions and Proposal Items'
    ],
    contextualPrompts: {
      speaker_analysis: true,
      sentiment_analysis: true,
      entity_extraction: true,
      action_items: true,
      timeline_extraction: true
    },
    customizations: {
      tone: ['professional', 'casual'],
      length: ['brief', 'detailed'],
      focus_areas: ['needs', 'objections', 'opportunities', 'next_steps']
    },
    businessContext: {
      suitable_for: ['Sales calls', 'Discovery meetings', 'Demo presentations', 'Proposal discussions'],
      typical_duration: '30-60 minutes',
      expected_participants: 4
    }
  }
];

export const LEGACY_TEMPLATES = [
  {
    id: 'meeting_summary' as TemplateType,
    name: 'Meeting Summary',
    description: 'Extract attendees, decisions, and action items',
    icon: '👥',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'client_update' as TemplateType,
    name: 'Client Update',
    description: 'Professional project status communication',
    icon: '📊',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'action_plan' as TemplateType,
    name: 'Action Plan',
    description: 'Organized tasks with priorities and deadlines',
    icon: '🎯',
    gradient: 'from-purple-500 to-violet-500',
  },
];

// Export the enhanced templates as the default
export const TEMPLATES = ENHANCED_TEMPLATES;

export const PROCESSING_STEPS = [
  {
    id: 'upload',
    title: 'Audio Upload',
    description: 'Securely uploading your audio file...',
    status: 'pending' as const,
  },
  {
    id: 'transcribe',
    title: 'Speech-to-Text',
    description: 'Converting speech to text using AI...',
    status: 'pending' as const,
  },
  {
    id: 'analyze',
    title: 'Content Analysis',
    description: 'Analyzing transcript for key insights...',
    status: 'pending' as const,
  },
  {
    id: 'generate',
    title: 'Brief Generation',
    description: 'Creating your professional brief...',
    status: 'pending' as const,
  },
  {
    id: 'storage',
    title: 'File Storage',
    description: 'Saving audio file to secure storage...',
    status: 'pending' as const,
  },
  {
    id: 'save',
    title: 'Save Results',
    description: 'Saving transcript and brief to database...',
    status: 'pending' as const,
  },
];