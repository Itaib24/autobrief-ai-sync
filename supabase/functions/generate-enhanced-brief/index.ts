import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// Enhanced template configurations with advanced prompting
const ENHANCED_TEMPLATE_CONFIGS = {
  meeting_summary: {
    systemPrompt: `You are a professional meeting summarizer with expertise in corporate communications. 
    Create structured, actionable meeting summaries that executives and team members can use for follow-up and decision-making.`,
    contextualInstructions: `
    MEETING SUMMARY INSTRUCTIONS:
    - Extract key participants and their roles from speaker segments
    - Identify concrete decisions made during the meeting
    - List actionable items with owners and deadlines when mentioned
    - Summarize discussion points without losing important context
    - Highlight unresolved issues that need follow-up
    - Maintain professional tone suitable for distribution
    
    OUTPUT STRUCTURE:
    # Meeting Overview
    - Date: [Extract or indicate "Not specified"]
    - Duration: [From metadata if available]
    - Participants: [List based on speakers and mentions]
    
    # Key Decisions Made
    [Bullet points of concrete decisions]
    
    # Action Items
    [Format: Task - Owner - Deadline - Priority]
    
    # Discussion Summary
    [Main topics covered with key points]
    
    # Next Steps & Follow-up
    [Immediate next actions and future meetings]
    
    # Outstanding Issues
    [Unresolved matters requiring attention]
    `,
    outputValidation: {
      requiredSections: [
        'Meeting Overview',
        'Key Decisions Made',
        'Action Items',
        'Discussion Summary'
      ],
      minWordCount: 150,
      maxWordCount: 1200
    }
  },
  client_update: {
    systemPrompt: `You are a client-facing project manager creating professional status updates. 
    Focus on transparency, progress communication, and building client confidence while addressing concerns proactively.`,
    contextualInstructions: `
    CLIENT UPDATE INSTRUCTIONS:
    - Emphasize progress and achievements prominently
    - Present challenges with solutions and mitigation plans
    - Use client-friendly language avoiding internal jargon
    - Include specific metrics and milestones when mentioned
    - Maintain optimistic but realistic tone
    - Structure information for busy executives
    
    OUTPUT STRUCTURE:
    # Project Status Overview
    [High-level status with key metrics]
    
    # Recent Achievements
    [Completed milestones and deliverables]
    
    # Current Progress
    [Work in progress with completion percentages]
    
    # Upcoming Deliverables
    [Next 2-4 weeks with dates]
    
    # Budget & Timeline Status
    [Financial and schedule updates]
    
    # Challenges & Mitigation
    [Issues identified with solution approaches]
    
    # Recommendations & Next Steps
    [Proposed actions and client decisions needed]
    
    # Upcoming Touchpoints
    [Scheduled meetings and reviews]
    `,
    outputValidation: {
      requiredSections: [
        'Project Status Overview',
        'Recent Achievements',
        'Current Progress',
        'Upcoming Deliverables'
      ],
      minWordCount: 200,
      maxWordCount: 1000
    }
  },
  action_plan: {
    systemPrompt: `You are a project management expert creating actionable plans from discussions. 
    Focus on clear task definition, realistic timelines, and resource allocation while maintaining strategic alignment.`,
    contextualInstructions: `
    ACTION PLAN INSTRUCTIONS:
    - Transform discussions into concrete, actionable tasks
    - Prioritize items based on urgency and importance
    - Assign ownership when speakers indicate responsibility
    - Include dependencies and resource requirements
    - Set realistic timelines based on discussed constraints
    - Define success criteria for measurable outcomes
    
    OUTPUT STRUCTURE:
    # Executive Summary
    [Brief overview of objectives and approach]
    
    # High Priority Actions
    [Critical tasks requiring immediate attention]
    
    # Medium Priority Actions
    [Important tasks with flexible timing]
    
    # Low Priority Actions
    [Nice-to-have items for later consideration]
    
    # Task Details
    [For each priority level:]
    - Task: [Clear description]
    - Owner: [Person responsible]
    - Deadline: [Target completion]
    - Dependencies: [Prerequisites]
    - Success Criteria: [How to measure completion]
    
    # Resource Requirements
    [Budget, tools, people, or other needs]
    
    # Timeline Overview
    [Visual or text-based schedule]
    
    # Risk Mitigation
    [Potential blockers and contingency plans]
    `,
    outputValidation: {
      requiredSections: [
        'Executive Summary',
        'High Priority Actions',
        'Task Details',
        'Timeline Overview'
      ],
      minWordCount: 250,
      maxWordCount: 1500
    }
  },
  interview_notes: {
    systemPrompt: `You are an experienced HR professional creating comprehensive interview documentation. 
    Focus on objective assessment, candidate strengths, and hiring recommendations while maintaining fairness and legal compliance.`,
    contextualInstructions: `
    INTERVIEW NOTES INSTRUCTIONS:
    - Document candidate responses objectively
    - Assess technical skills based on specific examples
    - Evaluate cultural fit through behavioral indicators
    - Note specific achievements and experience relevance
    - Identify development areas constructively
    - Provide clear hiring recommendation with rationale
    
    OUTPUT STRUCTURE:
    # Candidate Profile
    [Name, role, background summary]
    
    # Technical Skills Assessment
    [Skills demonstrated with specific examples]
    
    # Experience Evaluation
    [Relevant experience and achievements]
    
    # Cultural Fit Analysis
    [Values alignment and team compatibility]
    
    # Key Strengths
    [Top 3-5 candidate advantages]
    
    # Development Areas
    [Areas for growth or concern]
    
    # Interview Performance
    [Communication, preparation, engagement]
    
    # Recommendation
    [Hire/No Hire with detailed rationale]
    
    # Next Steps
    [Follow-up interviews, reference checks, etc.]
    `,
    outputValidation: {
      requiredSections: [
        'Candidate Profile',
        'Technical Skills Assessment',
        'Recommendation'
      ],
      minWordCount: 200,
      maxWordCount: 1000
    }
  },
  training_session: {
    systemPrompt: `You are a learning and development specialist creating comprehensive training summaries. 
    Focus on knowledge transfer, practical applications, and actionable takeaways for continued learning.`,
    contextualInstructions: `
    TRAINING SESSION INSTRUCTIONS:
    - Capture key learning objectives and outcomes
    - Document practical examples and case studies
    - Record important questions and answers
    - Note participant engagement and feedback
    - List actionable takeaways and follow-up items
    - Include additional resources mentioned
    
    OUTPUT STRUCTURE:
    # Session Overview
    [Topic, objectives, participants, duration]
    
    # Key Concepts Covered
    [Main learning points with explanations]
    
    # Practical Applications
    [Real-world examples and use cases]
    
    # Interactive Elements
    [Exercises, discussions, Q&A highlights]
    
    # Participant Feedback
    [Questions, comments, concerns raised]
    
    # Key Takeaways
    [Main insights participants should remember]
    
    # Action Items
    [Follow-up tasks for participants]
    
    # Additional Resources
    [References, tools, further reading mentioned]
    
    # Assessment & Follow-up
    [Evaluation methods and next sessions]
    `,
    outputValidation: {
      requiredSections: [
        'Session Overview',
        'Key Concepts Covered',
        'Key Takeaways'
      ],
      minWordCount: 200,
      maxWordCount: 1200
    }
  },
  sales_call: {
    systemPrompt: `You are a sales operations expert analyzing sales conversations. 
    Focus on opportunity qualification, customer needs analysis, and strategic next steps for deal progression.`,
    contextualInstructions: `
    SALES CALL INSTRUCTIONS:
    - Identify customer pain points and business needs
    - Document product/service interest areas
    - Record objections with context and responses
    - Note buying signals and decision-making process
    - Capture competitive landscape mentions
    - Define clear next steps for deal progression
    
    OUTPUT STRUCTURE:
    # Prospect Profile
    [Company, role, decision-making authority]
    
    # Needs Assessment
    [Business challenges and requirements identified]
    
    # Pain Points & Drivers
    [Current problems creating urgency]
    
    # Solutions Discussed
    [Products/services presented with interest level]
    
    # Objections & Responses
    [Concerns raised and how addressed]
    
    # Buying Signals
    [Positive indicators and engagement level]
    
    # Decision Process & Timeline
    [How decisions are made and expected timing]
    
    # Competitive Landscape
    [Other vendors mentioned or implied]
    
    # Proposed Next Steps
    [Immediate actions and follow-up plan]
    
    # Deal Qualification
    [BANT assessment and probability scoring]
    `,
    outputValidation: {
      requiredSections: [
        'Prospect Profile',
        'Needs Assessment',
        'Proposed Next Steps'
      ],
      minWordCount: 200,
      maxWordCount: 1000
    }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  console.log(`[${requestId}] Starting enhanced brief generation`);

  try {
    const requestData = await req.json();
    const { inputText, templateType, title, customizations = {}, speakerSegments = [], metadata = {} } = requestData;

    if (!inputText || !templateType) {
      throw new Error('Missing required fields: inputText and templateType');
    }

    console.log(`[${requestId}] Template: ${templateType}, input length: ${inputText.length} characters`);
    console.log(`[${requestId}] Customizations:`, customizations);

    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured. Please set GOOGLE_GEMINI_API_KEY in Supabase secrets.');
    }

    // Get template configuration
    const templateConfig = ENHANCED_TEMPLATE_CONFIGS[templateType];
    if (!templateConfig) {
      throw new Error(`Unknown template type: ${templateType}`);
    }

    // Build enhanced prompt with context
    const enhancedPrompt = buildContextualPrompt(templateConfig, inputText, customizations, speakerSegments, metadata, requestId);
    console.log(`[${requestId}] Enhanced prompt length: ${enhancedPrompt.length} characters`);

    // Call Gemini API with enhanced configuration
    const geminiResponse = await callGeminiWithRetry(geminiApiKey, enhancedPrompt, customizations, requestId);

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error(`[${requestId}] Gemini API error:`, errorData);
      throw new Error(getDetailedGeminiError(geminiResponse.status, errorData));
    }

    const result = await geminiResponse.json();
    console.log(`[${requestId}] Gemini response received`);

    // Extract and validate content
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!generatedText) {
      console.log(`[${requestId}] No content generated, response:`, result);
      throw new Error('No content generated by Gemini');
    }

    // Validate output quality
    const validationResult = validateOutput(generatedText, templateConfig, requestId);

    // Calculate metrics
    const wordCount = generatedText.split(/\s+/).filter((word) => word.length > 0).length;
    const processingTime = Date.now() - startTime;

    // Extract entities and perform analysis
    const analysis = performContentAnalysis(generatedText, speakerSegments, customizations);

    console.log(`[${requestId}] Successfully generated brief with ${wordCount} words in ${processingTime}ms`);

    const response = {
      generatedText: validationResult.correctedText || generatedText,
      title: title || generateTitle(templateType, customizations),
      templateType,
      wordCount,
      processingTime,
      qualityScore: validationResult.qualityScore,
      metadata: {
        ...metadata,
        customizations,
        analysis,
        processingTime
      },
      suggestions: validationResult.suggestions,
      warnings: validationResult.warnings,
      requestId
    };

    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(`[${requestId}] Error in enhanced brief generation:`, error);
    return new Response(JSON.stringify({
      error: error.message,
      requestId,
      suggestions: generateErrorSuggestions(error.message)
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});

function buildContextualPrompt(templateConfig, inputText, customizations, speakerSegments, metadata, requestId) {
  console.log(`[${requestId}] Building contextual prompt for ${templateConfig}`);

  // Speaker context
  let speakerContext = '';
  if (speakerSegments.length > 0) {
    speakerContext = `
SPEAKER SEGMENTS AVAILABLE:
${speakerSegments.map((seg) => `${seg.speaker} (${seg.startTime}-${seg.endTime}): "${seg.text.substring(0, 100)}..."`).join('\n')}

SPEAKER ANALYSIS:
- Total speakers identified: ${new Set(speakerSegments.map((s) => s.speaker)).size}
- Conversation flow analysis enabled
`;
  }

  // Customization context
  let customContext = '';
  if (customizations.tone) {
    customContext += `TONE REQUIREMENT: Use ${customizations.tone} tone throughout the document.\n`;
  }
  if (customizations.length) {
    customContext += `LENGTH REQUIREMENT: Create a ${customizations.length} version of the brief.\n`;
  }
  if (customizations.focusAreas && customizations.focusAreas.length > 0) {
    customContext += `FOCUS AREAS: Pay special attention to: ${customizations.focusAreas.join(', ')}\n`;
  }
  if (customizations.companyContext?.name) {
    customContext += `COMPANY CONTEXT: This is for ${customizations.companyContext.name}`;
    if (customizations.companyContext.industry) {
      customContext += ` in the ${customizations.companyContext.industry} industry`;
    }
    customContext += '.\n';
  }

  // Metadata context
  let metadataContext = '';
  if (metadata.duration) {
    metadataContext += `Meeting Duration: ${metadata.duration}\n`;
  }
  if (metadata.languageDetected) {
    metadataContext += `Language: ${metadata.languageDetected}\n`;
  }

  return `${templateConfig.systemPrompt}

${templateConfig.contextualInstructions}

${speakerContext}

${customContext}

${metadataContext}

CONTENT TO PROCESS:
${inputText}

Please create a professional ${templateConfig.outputValidation.requiredSections?.[0] || 'brief'} following the structure above. Ensure the output is well-formatted, actionable, and meets all specified requirements.`;
}

async function callGeminiWithRetry(apiKey, prompt, customizations, requestId) {
  const maxRetries = 3;
  let retryCount = 0;

  // Adjust temperature based on customizations
  let temperature = 0.3; // Default for professional content
  if (customizations.tone === 'casual') temperature = 0.5;
  if (customizations.tone === 'technical') temperature = 0.2;

  const generationConfig = {
    temperature,
    topK: 40,
    topP: 0.8,
    maxOutputTokens: customizations.length === 'comprehensive' ? 4000 : customizations.length === 'detailed' ? 2500 : 1500
  };

  while (retryCount <= maxRetries) {
    try {
      console.log(`[${requestId}] Gemini API call attempt ${retryCount + 1}/${maxRetries + 1}`);
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig,
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });
      return response;
    } catch (fetchError) {
      retryCount++;
      console.log(`[${requestId}] Retry ${retryCount}/${maxRetries} after fetch error:`, fetchError);
      if (retryCount > maxRetries) {
        throw new Error(`Failed to connect to Gemini API after ${maxRetries} retries: ${fetchError.message}`);
      }
      // Exponential backoff
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`[${requestId}] Waiting ${delay}ms before retry`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Retry logic failed unexpectedly');
}

function validateOutput(generatedText, templateConfig, requestId) {
  const warnings = [];
  const suggestions = [];
  let qualityScore = 1.0;

  // Word count validation
  const wordCount = generatedText.split(/\s+/).filter((word) => word.length > 0).length;
  if (wordCount < templateConfig.outputValidation.minWordCount) {
    warnings.push(`Output is shorter than recommended (${wordCount} words vs ${templateConfig.outputValidation.minWordCount} minimum)`);
    qualityScore *= 0.8;
  }
  if (wordCount > templateConfig.outputValidation.maxWordCount) {
    warnings.push(`Output is longer than recommended (${wordCount} words vs ${templateConfig.outputValidation.maxWordCount} maximum)`);
    qualityScore *= 0.9;
  }

  // Structure validation
  const requiredSections = templateConfig.outputValidation.requiredSections || [];
  const missingSections = requiredSections.filter((section) => !generatedText.toLowerCase().includes(section.toLowerCase()));
  if (missingSections.length > 0) {
    warnings.push(`Missing recommended sections: ${missingSections.join(', ')}`);
    qualityScore *= 0.7;
  }

  // Quality suggestions
  if (wordCount > 800) {
    suggestions.push('Consider using bullet points for better readability');
  }
  if (generatedText.split('\n').length < 5) {
    suggestions.push('Add more structure with headings and sections');
  }

  console.log(`[${requestId}] Quality validation: score ${qualityScore}, ${warnings.length} warnings, ${suggestions.length} suggestions`);

  return {
    qualityScore: Math.round(qualityScore * 100) / 100,
    suggestions,
    warnings
  };
}

function performContentAnalysis(generatedText, speakerSegments, customizations) {
  // Extract action items
  const actionItemsRegex = /(?:action item|task|to-do|follow[- ]?up|next step)[\s\S]*?(?:\n|$)/gi;
  const actionItems = (generatedText.match(actionItemsRegex) || []).length;

  // Extract entities (simple regex-based)
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g;
  const dateRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/gi;

  const extractedEntities = [
    ...generatedText.match(emailRegex) || [],
    ...generatedText.match(phoneRegex) || [],
    ...generatedText.match(dateRegex) || []
  ];

  // Simple sentiment analysis (positive/negative word counting)
  const positiveWords = [
    'success',
    'achieve',
    'progress',
    'excellent',
    'good',
    'positive',
    'effective'
  ];
  const negativeWords = [
    'issue',
    'problem',
    'concern',
    'delay',
    'risk',
    'challenge',
    'difficult'
  ];

  const positiveCount = positiveWords.reduce((count, word) => count + (generatedText.toLowerCase().match(new RegExp(word, 'g')) || []).length, 0);
  const negativeCount = negativeWords.reduce((count, word) => count + (generatedText.toLowerCase().match(new RegExp(word, 'g')) || []).length, 0);
  const sentimentScore = (positiveCount - negativeCount) / Math.max(1, positiveCount + negativeCount);

  return {
    actionItemsCount: actionItems,
    extractedEntities: extractedEntities.slice(0, 10),
    sentimentScore: Math.round(sentimentScore * 100) / 100,
    speakersAnalyzed: new Set(speakerSegments.map((s) => s.speaker)).size
  };
}

function generateTitle(templateType, customizations) {
  const baseTitle = templateType.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  
  if (customizations.companyContext?.name) {
    return `${baseTitle} - ${customizations.companyContext.name}`;
  }
  
  return `${baseTitle} Brief`;
}

function getDetailedGeminiError(status, errorData) {
  switch (status) {
    case 403:
      return 'Gemini API access denied. Please ensure: 1) Generative AI API is enabled, 2) API key has correct permissions, 3) Billing is enabled';
    case 400:
      return 'Invalid request to Gemini API. Content may violate safety guidelines or exceed limits';
    case 429:
      return 'Gemini API rate limit exceeded. Please wait a moment and try again';
    case 500:
      return 'Gemini API server error. Please try again in a few moments';
    default:
      return `Gemini API error (${status}): ${errorData}`;
  }
}

function generateErrorSuggestions(errorMessage) {
  const suggestions = [];
  
  if (errorMessage.includes('access denied') || errorMessage.includes('403')) {
    suggestions.push('Verify Gemini API key in Supabase secrets');
    suggestions.push('Enable Generative Language API in Google Cloud Console');
    suggestions.push('Check API key permissions and billing status');
  } else if (errorMessage.includes('safety guidelines') || errorMessage.includes('400')) {
    suggestions.push('Review content for inappropriate language');
    suggestions.push('Try with different template or customization options');
    suggestions.push('Ensure transcript contains business-appropriate content');
  } else if (errorMessage.includes('No content generated')) {
    suggestions.push('Check if transcript has sufficient content');
    suggestions.push('Try with a different template type');
    suggestions.push('Verify API response format');
  }
  
  return suggestions;
} 