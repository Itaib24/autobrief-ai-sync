import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BriefOptions {
  templateType?: string;
  tone?: string;
  length?: string;
  customInstructions?: string;
  enhancedFormatting?: boolean;
  includeMetrics?: boolean;
  generateSummary?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestId = crypto.randomUUID();
    console.log(`[${requestId}] Starting brief generation`);

    const { transcriptionText, options = {} } = await req.json();
    
    if (!transcriptionText) {
      throw new Error('No transcription text provided');
    }

    if (transcriptionText.length < 10) {
      throw new Error('Transcription text too short to generate meaningful brief');
    }

    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured. Please set GOOGLE_GEMINI_API_KEY in Supabase secrets.');
    }

    const { templateType = 'meeting_summary', tone = 'professional', length = 'detailed' } = options as BriefOptions;

    console.log(`[${requestId}] Generating ${templateType} brief, ${length} length, ${tone} tone`);

    const briefTemplates = {
      'meeting_summary': `
        **CORPORATE MEETING DOCUMENTATION STYLE**
        Create an executive-level meeting summary with professional corporate tone.
        
        # 📋 Meeting Summary
        **Date:** ${new Date().toLocaleDateString()} | **Type:** [Meeting Type] | **Duration:** [Estimate]
        
        ## 🎯 Executive Overview
        [Provide a high-level 2-3 sentence summary of the meeting's purpose and key outcomes]
        
        ## 🔍 Key Discussion Points
        [Organized discussion topics with clear context and implications]
        • **Topic 1:** [Discussion summary with context]
        • **Topic 2:** [Discussion summary with business impact]
        
        ## ✅ Decisions & Resolutions
        [Formal decisions made with clear ownership and rationale]
        1. **Decision:** [What was decided] | **Owner:** [Responsible party] | **Rationale:** [Why]
        
        ## 📋 Action Items & Deliverables
        [Structured task assignments with accountability]
        | **Action Item** | **Owner** | **Due Date** | **Priority** | **Dependencies** |
        |------------------|-----------|--------------|--------------|------------------|
        | [Task description] | [Name] | [Date] | [High/Med/Low] | [If any] |
        
        ## 🚀 Strategic Next Steps
        [Future planning and follow-up initiatives]
        
        ## 📊 Success Metrics
        [How progress will be measured]
        
        **Executive Summary:** [One powerful paragraph capturing the meeting's strategic value]
      `,
      'client_update': `
        **PROFESSIONAL CLIENT COMMUNICATION STYLE**
        Create a confidence-building client update with progress-focused, reassuring tone.
        
        # 📊 Project Progress Report
        **Client:** [Client Name] | **Period:** [Timeframe] | **Project:** [Project Name]
        
        ## 🎉 Achievements This Period
        [Celebrate completed milestones with tangible business value]
        ✅ **Milestone 1:** [Achievement with business impact]
        ✅ **Milestone 2:** [Achievement with client benefit]
        
        ## 📈 Current Progress Status
        [Visual progress indicators and current focus areas]
        **Overall Progress:** [X]% Complete
        **Current Sprint:** [What we're actively working on]
        **Quality Metrics:** [Performance indicators]
        
        ## 🔮 Upcoming Deliverables
        [What client can expect next with clear timelines]
        📅 **Next 2 Weeks:** [Immediate deliverables]
        📅 **Next Month:** [Upcoming milestones]
        
        ## 💡 Strategic Recommendations
        [Proactive suggestions for optimization and value enhancement]
        
        ## 🤝 Client Action Items
        [What we need from client to maintain momentum]
        
        ## 🛡️ Risk Management
        [Transparent risk communication with mitigation strategies]
        
        **Partnership Statement:** [Reinforce commitment and next touchpoint]
      `,
      'action_plan': `
        **DIRECTIVE PROJECT MANAGEMENT STYLE**
        Create a results-driven action plan with clear priorities and execution focus.
        
        # 🎯 Strategic Action Plan
        **Initiative:** [Project/Initiative Name] | **Created:** ${new Date().toLocaleDateString()}
        
        ## 🚀 Mission Statement
        [Clear, motivating statement of what we're achieving]
        
        ## 🔥 Critical Path Actions
        [Highest priority items that drive success]
        
        ### 🟥 HIGH PRIORITY (Do First)
        | **Action** | **Owner** | **Due** | **Success Criteria** | **Dependencies** |
        |------------|-----------|---------|---------------------|------------------|
        | [Critical task] | [Name] | [Date] | [Measurable outcome] | [What's needed] |
        
        ### 🟨 MEDIUM PRIORITY (Do Next)
        [Important but not blocking critical path]
        
        ### 🟩 LOW PRIORITY (Do Later)
        [Nice-to-have items for future consideration]
        
        ## 🎯 Success Metrics & KPIs
        [How we measure victory]
        • **Primary KPI:** [Main success metric]
        • **Secondary KPIs:** [Supporting metrics]
        
        ## 🛠️ Resource Requirements
        [What we need to succeed]
        **Human Resources:** [Team/skills needed]
        **Tools & Technology:** [Required systems]
        **Budget:** [Financial requirements]
        
        ## ⚠️ Risk Mitigation
        [Potential blockers and solutions]
        
        **Execution Motto:** [Rallying cry for the team]
      `,
      'interview_notes': `
        **OBJECTIVE HR ASSESSMENT STYLE**
        Create structured interview documentation with professional evaluation tone.
        
        # 🤝 Candidate Interview Assessment
        **Date:** ${new Date().toLocaleDateString()} | **Position:** [Role] | **Interviewer(s):** [Names]
        
        ## 👤 Candidate Profile
        **Name:** [Candidate Name]
        **Background:** [Professional summary]
        **Experience Level:** [Years/seniority]
        
        ## 🎯 Technical Competencies
        [Objective skill assessment with evidence]
        
        ### Core Technical Skills
        | **Skill Area** | **Proficiency** | **Evidence/Examples** | **Assessment** |
        |----------------|-----------------|----------------------|----------------|
        | [Technology] | [Beginner/Intermediate/Advanced] | [Specific examples given] | [Evaluator notes] |
        
        ## 💼 Experience Evaluation
        [Career progression and relevant experience]
        **Strengths:** [Key professional strengths with examples]
        **Growth Areas:** [Development opportunities identified]
        
        ## 🧠 Problem-Solving Assessment
        [How candidate approaches challenges]
        
        ## 🤝 Cultural Fit Indicators
        [Alignment with company values and team dynamics]
        
        ## 💬 Notable Questions & Responses
        [Key interview moments and candidate insights]
        
        ## 📊 Overall Assessment
        **Technical Rating:** [Score/Grade]
        **Cultural Fit:** [Score/Grade]
        **Communication:** [Score/Grade]
        
        ## 🚀 Recommendation
        [Clear next steps and hiring recommendation]
        **Decision:** [Proceed/Hold/Pass] | **Rationale:** [Why]
      `,
      'sales_call': `
        **SALES INTELLIGENCE & CRM STYLE**
        Create a comprehensive sales analysis with opportunity-focused, strategic tone.
        
        # 💼 Sales Intelligence Report
        **Prospect:** [Company/Contact] | **Date:** ${new Date().toLocaleDateString()} | **Rep:** [Sales Rep]
        
        ## 🎯 Opportunity Overview
        **Deal Size:** [Estimated value] | **Timeline:** [Expected close] | **Probability:** [Likelihood %]
        **Decision Maker:** [Key contact] | **Competition:** [Competing vendors]
        
        ## 🔍 Discovery Insights
        [Critical business intelligence gathered]
        
        ### Pain Points Identified
        🟥 **Critical Pain:** [Urgent business problem]
        🟨 **Secondary Pain:** [Additional challenges]
        
        ### Business Impact Analysis
        **Current State Cost:** [What inaction costs them]
        **Desired Future State:** [Their vision of success]
        **ROI Potential:** [Value we can deliver]
        
        ## 💡 Solutions Positioning
        [How our offering addresses their needs]
        **Primary Solution:** [Core product/service fit]
        **Value Proposition:** [Why we're the best choice]
        **Differentiators:** [What sets us apart]
        
        ## 🚧 Objections & Responses
        [Concerns raised and how we addressed them]
        | **Objection** | **Response Strategy** | **Resolution Status** |
        |---------------|----------------------|----------------------|
        | [Concern raised] | [How we responded] | [Resolved/Pending] |
        
        ## 📈 Buying Signals Detected
        [Positive indicators of purchase intent]
        
        ## 🎯 Next Steps Strategy
        [Tactical follow-up plan]
        **Immediate Actions:** [What we do in next 48 hours]
        **Proposal Requirements:** [What they need to see]
        **Decision Timeline:** [Their buying process]
        
        ## 🏆 Win Strategy
        [How we close this deal]
        **Key Stakeholders to Influence:** [Who matters]
        **Competitive Advantage:** [Our winning edge]
        **Close Plan:** [Path to signature]
      `,
      'training_session': `
        **EDUCATIONAL & LEARNING-FOCUSED STYLE**
        Create comprehensive training documentation with learning-outcome emphasis.
        
        # 🎓 Training Session Documentation
        **Program:** [Training Title] | **Date:** ${new Date().toLocaleDateString()} | **Facilitator:** [Instructor]
        
        ## 🎯 Learning Objectives Achieved
        [What participants accomplished]
        ✅ **Primary Objective:** [Main learning goal]
        ✅ **Secondary Objectives:** [Supporting skills gained]
        
        ## 📚 Curriculum Coverage
        [Knowledge areas explored with depth indicators]
        
        ### Core Concepts Mastered
        | **Concept** | **Complexity** | **Practical Application** | **Mastery Level** |
        |-------------|----------------|---------------------------|-------------------|
        | [Topic] | [Basic/Intermediate/Advanced] | [Real-world use] | [Participant understanding] |
        
        ## 💡 Key Learning Insights
        [Breakthrough moments and understanding]
        
        ## 🛠️ Practical Applications
        [How to use this knowledge in real work]
        **Immediate Applications:** [What to do tomorrow]
        **Long-term Development:** [Skills to build over time]
        
        ## 🤔 Questions & Clarifications
        [Important Q&A that benefits all learners]
        
        ## 📈 Participant Engagement Analysis
        [Learning effectiveness and participation quality]
        **Engagement Level:** [High/Medium/Low]
        **Knowledge Retention Indicators:** [Signs of understanding]
        
        ## 🎯 Action Learning Plan
        [What participants commit to doing]
        **Individual Development Goals:** [Personal learning objectives]
        **Team Implementation:** [Collective action items]
        
        ## 📖 Continued Learning Resources
        [Materials for ongoing development]
        **Recommended Reading:** [Books/articles]
        **Practice Opportunities:** [Ways to apply skills]
        **Follow-up Support:** [Available assistance]
        
        **Learning Impact Statement:** [How this training changes their capability]
      `
    };

    const summaryTemplates = {
      'meeting_summary': `
        **EXECUTIVE SUMMARY STYLE**
        Create a powerful 3-4 sentence executive summary that captures:
        1. The meeting's strategic purpose and key participants
        2. The most critical decisions made and their business impact
        3. The top 2-3 action items that drive results
        4. The next major milestone or follow-up requirement
        
        Focus on outcomes that matter to senior leadership. Use confident, results-oriented language.
      `,
      'client_update': `
        **CLIENT-FOCUSED SUMMARY STYLE**
        Create a reassuring 3-4 sentence client summary that emphasizes:
        1. Tangible progress made and value delivered
        2. Current momentum and team commitment
        3. Next deliverable the client will receive and when
        4. The partnership's continued strength and trajectory
        
        Use confident, relationship-building language that reinforces trust and progress.
      `,
      'action_plan': `
        **RESULTS-DRIVEN SUMMARY STYLE**
        Create an action-oriented 3-4 sentence summary that highlights:
        1. The strategic objective and success vision
        2. The top priority actions that will drive results
        3. Key dependencies and resource requirements
        4. The timeline for achieving measurable outcomes
        
        Use decisive, execution-focused language that motivates action.
      `,
      'interview_notes': `
        **HIRING DECISION SUMMARY STYLE**
        Create a clear 3-4 sentence assessment summary that covers:
        1. The candidate's strongest technical and professional qualifications
        2. Their fit with team culture and role requirements
        3. Any significant concerns or development areas identified
        4. Clear recommendation for next steps in the hiring process
        
        Use objective, professional language that supports decision-making.
      `,
      'sales_call': `
        **SALES OPPORTUNITY SUMMARY STYLE**
        Create a compelling 3-4 sentence opportunity summary that captures:
        1. The prospect's key pain points and business impact
        2. Our solution fit and competitive advantage
        3. The deal size, timeline, and probability assessment
        4. Critical next steps to advance the opportunity
        
        Use strategic, opportunity-focused language that drives sales action.
      `,
      'training_session': `
        **LEARNING IMPACT SUMMARY STYLE**
        Create an outcome-focused 3-4 sentence learning summary that highlights:
        1. The key skills and knowledge participants gained
        2. The most impactful learning moments or breakthroughs
        3. How participants will apply this learning in their work
        4. The measurable improvement in team capability
        
        Use growth-oriented, capability-building language that demonstrates value.
      `
    };

    const selectedBriefTemplate = briefTemplates[templateType as keyof typeof briefTemplates] || briefTemplates.meeting_summary;
    const selectedSummaryTemplate = summaryTemplates[templateType as keyof typeof summaryTemplates] || summaryTemplates.meeting_summary;
    
    const briefPrompt = `
      Please analyze the following transcription and create a comprehensive brief using this template.
      
      Template Style & Structure:
      ${selectedBriefTemplate}
      
      Transcription to analyze:
      ${transcriptionText}
      
      Instructions:
      - Follow the template structure and style exactly - this is crucial for consistency
      - Extract relevant information from the transcription and organize it professionally
      - Use a ${tone} tone throughout that matches the template's business context
      - Make the brief ${length === 'detailed' ? 'comprehensive with full details and rich formatting' : 'concise but complete'}
      - If information for a section is not available in the transcription, write "[Information not provided in audio]" instead of making up content
      - Focus on actionable insights, clear next steps, and professional presentation
      - Use the exact formatting style (headers, tables, emojis, structure) shown in the template
      ${options.customInstructions ? `- Additional custom requirements: ${options.customInstructions}` : ''}
      - Ensure the output is professional-grade and ready for business use
    `;

    const summaryPrompt = `
      Based on the following transcription, create a powerful executive summary using this style guide.
      
      Summary Style Guide:
      ${selectedSummaryTemplate}
      
      Transcription to summarize:
      ${transcriptionText}
      
      Instructions:
      - Create a compelling 3-4 sentence summary that captures the essence
      - Match the tone and focus area specified in the style guide
      - Extract only the most critical information that drives decisions
      - Use confident, impactful language appropriate for senior stakeholders
      - Focus on outcomes, value, and actionable insights
      - Do not exceed 4 sentences - be extremely selective and powerful
    `;

    console.log(`[${requestId}] Calling Gemini API for brief generation`);

    // Generate Brief with parallel processing capability
    const briefResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: briefPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 3072,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!briefResponse.ok) {
      const errorText = await briefResponse.text();
      console.error(`[${requestId}] Gemini API brief error:`, errorText);
      throw new Error(`Gemini API brief error: ${briefResponse.status} - ${errorText}`);
    }

    const briefData = await briefResponse.json();
    console.log(`[${requestId}] Brief generation completed`);
    
    if (!briefData.candidates || !briefData.candidates[0] || !briefData.candidates[0].content) {
      console.error(`[${requestId}] Invalid brief response structure:`, briefData);
      throw new Error('Invalid response from Gemini API - no brief content generated');
    }

    const generatedBrief = briefData.candidates[0].content.parts[0].text;
    const briefWordCount = generatedBrief.split(/\s+/).length;

    console.log(`[${requestId}] Generating executive summary`);

    // Generate Summary
    const summaryResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: summaryPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 20,
          topP: 0.9,
          maxOutputTokens: 512,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!summaryResponse.ok) {
      const errorText = await summaryResponse.text();
      console.error(`[${requestId}] Gemini API summary error:`, errorText);
      throw new Error(`Gemini API summary error: ${summaryResponse.status} - ${errorText}`);
    }

    const summaryData = await summaryResponse.json();
    console.log(`[${requestId}] Summary generation completed`);
    
    if (!summaryData.candidates || !summaryData.candidates[0] || !summaryData.candidates[0].content) {
      console.error(`[${requestId}] Invalid summary response structure:`, summaryData);
      throw new Error('Invalid response from Gemini API - no summary content generated');
    }

    const generatedSummary = summaryData.candidates[0].content.parts[0].text;
    const summaryWordCount = generatedSummary.split(/\s+/).length;

    console.log(`[${requestId}] Brief: ${briefWordCount} words, Summary: ${summaryWordCount} words`);

    // Calculate quality scores
    const briefQualityScore = Math.min(100, Math.max(0, 
      (briefWordCount / 15) + 
      (generatedBrief.includes('#') ? 25 : 0) + 
      (generatedBrief.includes('|') ? 15 : 0) + // Tables
      (generatedBrief.includes('✅') || generatedBrief.includes('🎯') ? 10 : 0) // Formatting
    ));

    const summaryQualityScore = Math.min(100, Math.max(0, 
      75 + (summaryWordCount >= 50 && summaryWordCount <= 100 ? 25 : 0) // Optimal length bonus
    ));

    return new Response(
      JSON.stringify({ 
        success: true,
        brief: generatedBrief,
        summary: generatedSummary,
        templateType: templateType,
        briefWordCount: briefWordCount,
        summaryWordCount: summaryWordCount,
        totalWordCount: briefWordCount + summaryWordCount,
        metadata: {
          requestId: requestId,
          processedAt: new Date().toISOString(),
          options: options,
          processingTime: Date.now() - Date.parse(new Date().toISOString()),
          templateStyle: `${templateType}_enhanced_v2`
        },
        qualityScore: Math.round((briefQualityScore + summaryQualityScore) / 2),
        briefQualityScore: Math.round(briefQualityScore),
        summaryQualityScore: Math.round(summaryQualityScore)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-brief-with-gemini function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});