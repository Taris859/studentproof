// StudentProof AI Copilot Live API Integration & Fallbacks
// Calls NVIDIA API endpoints utilizing DeepSeek/Mistral models, and falls back to clean mocks if CORS/network blocks occur.

export interface ResumeResult {
  score: number;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  keywords: string[];
  suggestions: string[];
  bulletPoints: { original: string; improved: string }[];
}

export interface InternshipReport {
  riskLevel: 'Low' | 'Medium' | 'High';
  positives: string[];
  risks: string[];
  questions: string[];
  verifications: string[];
  action: string;
}

export interface ApplicationMaterials {
  coverLetter: string;
  whyHire: string;
  linkedin: string;
  coldEmail: string;
  interviewIntro: string;
}

export interface InterviewFeedback {
  confidence: number;
  clarity: number;
  professionalism: number;
  suggestions: string[];
  betterVersion: string;
  mistakes: string[];
  followUps: string[];
}

export interface PresentationReport {
  score: number;
  structure: { slide: string; description: string; status: 'strong' | 'weak' | 'neutral' }[];
  weakSlides: string[];
  strongSlides: string[];
  tips: string[];
  qaPrep: { question: string; answer: string }[];
  engagement: string[];
}

export interface AssignmentExplanation {
  summary: string;
  presentationPoints: string[];
  vivaQuestions: { question: string; answer: string }[];
  importantTopics: string[];
}

// API Credentials
const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const DEEPSEEK_KEY = "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";
const MISTRAL_KEY = "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";

// Helper to query NVIDIA API with key fallbacks
async function queryLLM(promptText: string, systemPrompt: string): Promise<string> {
  const payload = {
    model: "deepseek-ai/deepseek-v4-flash",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: promptText }
    ],
    temperature: 0.3,
    max_tokens: 4000
  };

  try {
    // Try primary key (DeepSeek)
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Primary API failed with status ${response.status}`);
    }

    const json = await response.json();
    return json.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.warn("Primary API failed. Attempting Mistral fallback...", error);
    
    // Try secondary key (Mistral)
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${MISTRAL_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...payload,
          model: "mistralai/mistral-medium-3.5-128b"
        })
      });

      if (!response.ok) {
        throw new Error(`Secondary API failed with status ${response.status}`);
      }

      const json = await response.json();
      return json.choices?.[0]?.message?.content || "";
    } catch (fallbackError) {
      console.error("NVIDIA API connection blocked (CORS / network). Using offline mock engines.");
      throw fallbackError;
    }
  }
}

// Clean JSON response from model text
function extractJson(text: string) {
  const jsonRegex = /```(?:json)?([\s\S]*?)```/i;
  const match = text.match(jsonRegex);
  const cleanText = match ? match[1].trim() : text.trim();
  
  try {
    return JSON.parse(cleanText);
  } catch (e) {
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      const extracted = cleanText.substring(firstBrace, lastBrace + 1);
      return JSON.parse(extracted);
    }
    throw e;
  }
}

// 1. Resume Analyzer
export async function analyzeResume(resumeText: string): Promise<ResumeResult> {
  const systemPrompt = `You are an expert recruiter and ATS resume optimization engine. Your goal is to analyze the resume text provided by the user. You must respond in a valid JSON object matching the following structure:
{
  "score": 82, // number 0-100
  "atsScore": 78, // number 0-100
  "strengths": ["Clear structure"], // string[]
  "weaknesses": ["Unquantified outcomes"], // string[]
  "keywords": ["TypeScript", "Docker"], // missing keywords, string[]
  "suggestions": ["Add metrics"], // string[]
  "bulletPoints": [
    {
      "original": "Worked on website",
      "improved": "Developed responsive portal using PHP, increasing student signups by 35%."
    }
  ]
}
Output only the JSON code block. Do not add conversational intro/outro text.`;

  try {
    const content = await queryLLM(resumeText, systemPrompt);
    return extractJson(content) as ResumeResult;
  } catch (e) {
    // Offline Mock Fallback
    console.warn("Using Offline Mock Fallback for Resume Analyzer.");
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      score: 76,
      atsScore: 71,
      strengths: [
        'Clear educational timelines and CS major details.',
        'Proper division of labor outline in experience grids.',
        'Clean contact details parsed correctly.'
      ],
      weaknesses: [
        'Unquantified experience bullet points.',
        'Missing modern package systems like Docker or Webpack.',
        'Lack of active leadership verbs.'
      ],
      keywords: ['CI/CD Pipeline', 'RESTful API', 'TypeScript', 'Agile Methodology', 'Docker', 'Webpack'],
      suggestions: [
        'Add quantitative figures to projects (e.g. serving 500+ users).',
        'Insert skills section mapping keywords directly.',
        'Use action verbs (e.g., engineered, launched).'
      ],
      bulletPoints: [
        {
          original: 'Worked on website for local club',
          improved: 'Developed responsive WordPress portal using PHP and CSS, increasing student signups by 35%.'
        },
        {
          original: 'Programmed python scripts',
          improved: 'Automated database backups using Python cron jobs, reducing manual pipeline tasks by 14 hours/week.'
        }
      ]
    };
  }
}

// 2. Internship Checker
export async function checkInternship(params: {
  title: string;
  company: string;
  website: string;
  description: string;
  email: string;
  stipend: string;
  duration: string;
  locationType: string;
  paymentRequested: 'Yes' | 'No';
}): Promise<InternshipReport> {
  const systemPrompt = `You are a student protection auditor. Analyze the internship details for scam indicators, safety alerts, or red flags. Legitimate employers NEVER charge applicants. Public emails (gmail, yahoo, etc.) represent a medium warning. You must respond in a valid JSON object matching the following structure:
{
  "riskLevel": "Low" | "Medium" | "High",
  "positives": ["Paid compensation/stipend declared"], // string[]
  "risks": ["Requests payment for registration"], // string[]
  "questions": ["Can you clarify daily tasks?"], // string[] to ask recruiter
  "verifications": ["Search company on WhoIs"], // string[] to verify
  "action": "caution summary action recommendations" // string
}
Never claim absolute certainty. Always phrase risk warnings as "Potential risk indicators detected". Output only the JSON.`;

  const inputPrompt = `Title: ${params.title}
Company: ${params.company}
Website: ${params.website}
Description: ${params.description}
Email: ${params.email}
Stipend: ${params.stipend}
Duration: ${params.duration}
Location: ${params.locationType}
Payment Requested: ${params.paymentRequested}`;

  try {
    const content = await queryLLM(inputPrompt, systemPrompt);
    return extractJson(content) as InternshipReport;
  } catch (e) {
    // Offline Mock Fallback
    console.warn("Using Offline Mock Fallback for Internship Checker.");
    await new Promise((resolve) => setTimeout(resolve, 800));

    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    const risks: string[] = [];
    const positives: string[] = [];
    
    if (params.paymentRequested === 'Yes') {
      riskLevel = 'High';
      risks.push('Requested payment for security deposits or guaranteed placement. Legitimate employers NEVER charge applicants.');
    }
    const emailDomain = params.email.split('@')[1] || '';
    if (['gmail.com', 'yahoo.com', 'outlook.com'].includes(emailDomain.toLowerCase())) {
      if (riskLevel !== 'High') riskLevel = 'Medium';
      risks.push(`Uses a public email domain (@${emailDomain}) rather than an official company address.`);
    } else if (params.email) {
      positives.push('Using a corporate-aligned email address suffix.');
    }

    return {
      riskLevel,
      positives,
      risks,
      questions: ['Could you clarify the daily tasks and what projects I will contribute to?', 'Who will be my primary mentor?'],
      verifications: [`Cross-check the domain name "${params.website}" on WhoIs registry.`],
      action: riskLevel === 'High' ? 'CAUTION: Highly unsafe indicators detected. We recommend rejecting this offer.' : 'Opportunity parameters look normal. Proceed with normal application steps.'
    };
  }
}

// 3. Application Generator
export async function generateApplication(params: {
  role: string;
  company: string;
  skills: string;
  experience: string;
  projects: string;
  tone: 'Professional' | 'Friendly' | 'Confident';
}): Promise<ApplicationMaterials> {
  const systemPrompt = `You are a career writing assistant. Draft professional cover letters, outreach notes, and pitches for the student. Formulate these documents aligning with the tone "${params.tone}". Respond in a valid JSON object matching the following structure:
{
  "coverLetter": "Dear Hiring Team...",
  "whyHire": "You should hire me because...",
  "linkedin": "Hi, I saw the open role...",
  "coldEmail": "Subject: ...\\n\\nDear ...",
  "interviewIntro": "Hello, I am..."
}
Output only the JSON.`;

  const inputPrompt = `Role: ${params.role}
Company: ${params.company}
Skills: ${params.skills}
Experience: ${params.experience}
Projects: ${params.projects}
Tone: ${params.tone}`;

  try {
    const content = await queryLLM(inputPrompt, systemPrompt);
    return extractJson(content) as ApplicationMaterials;
  } catch (e) {
    // Offline Mock Fallback
    console.warn("Using Offline Mock Fallback for Application Generator.");
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      coverLetter: `Dear Hiring Manager at ${params.company},\n\nI am writing to express my strong interest in the ${params.role} position. With my skills in ${params.skills}, I am eager to contribute to your engineering objectives. I recently engineered a project involving ${params.projects}, which refined my understanding of MVC concepts.`,
      whyHire: `You should hire me because my technical stack in ${params.skills} matches your job requirements, and I have proven academic experience building ${params.projects}.`,
      linkedin: `Hey! I noticed your team at ${params.company} is looking for a ${params.role}. I love using ${params.skills} and would love to connect.`,
      coldEmail: `Subject: Application: ${params.role} - Alex Carter\n\nDear Team,\n\nI hope this finds you well. I am reaching out regarding the ${params.role} role at ${params.company}. I focus on ${params.skills}.\n\nBest regards,\nAlex Carter`,
      interviewIntro: `Hello, I'm Alex Carter. I'm a student specializing in development, specifically using ${params.skills}. Recently, I engineered ${params.projects}.`
    };
  }
}

// 4. Interview Coach
export async function analyzeInterviewAnswer(answerText: string): Promise<InterviewFeedback> {
  const systemPrompt = `You are an interview preparation coach. Grade the student's interview answer and supply constructive suggestions, structural errors, and follow-ups. Respond in a valid JSON object matching the following structure:
{
  "confidence": 65, // number 0-100
  "clarity": 70, // number 0-100
  "professionalism": 58, // number 0-100
  "suggestions": ["Structure story with STAR method"], // string[]
  "betterVersion": "In my academic team project...", // string
  "mistakes": ["Blaming teammates directly"], // string[]
  "followUps": ["How did you encourage labor division?"] // string[]
}
Output only the JSON.`;

  try {
    const content = await queryLLM(answerText, systemPrompt);
    return extractJson(content) as InterviewFeedback;
  } catch (e) {
    // Offline Mock Fallback
    console.warn("Using Offline Mock Fallback for Interview Coach.");
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      confidence: 68,
      clarity: 72,
      professionalism: 60,
      suggestions: [
        'Structure the response using the STAR method (Situation, Task, Action, Result).',
        'Avoid directly criticizing team members in behavioral responses.'
      ],
      betterVersion: 'In my academic database project, we developed a Python data analysis tool. When coordination challenges arose, I coordinated sprint tasks. As a result, we finished the delivery 3 days early, earning an A grade.',
      mistakes: [
        'Blaming teammates directly projects poor conflict-management traits.',
        'Vague metrics reduces perceived engineering impact.'
      ],
      followUps: [
        'How did you facilitate division of labor for the remaining database schemas?'
      ]
    };
  }
}

// 5. Presentation Analyzer
export async function analyzePresentation(notesText: string): Promise<PresentationReport> {
  const systemPrompt = `You are a public speaking and slide deck presentation auditor. Review the presentation notes/structure for visual layout density and delivery performance. Respond in a valid JSON object matching the following structure:
{
  "score": 85, // number 0-100
  "structure": [{ "slide": "Slide 1: Title", "description": "Good visual tag", "status": "strong" | "weak" | "neutral" }],
  "weakSlides": ["Slide 2: Bullets dense"], // string[]
  "strongSlides": ["Slide 1: tagline memorable"], // string[]
  "tips": ["Maintain 10/20/30 rule"], // string[]
  "qaPrep": [{ "question": "Security setup?", "answer": "Uses local encryption" }],
  "engagement": ["Open with audience poll"] // string[]
}
Output only the JSON.`;

  try {
    const content = await queryLLM(notesText, systemPrompt);
    return extractJson(content) as PresentationReport;
  } catch (e) {
    // Offline Mock Fallback
    console.warn("Using Offline Mock Fallback for Presentation Analyzer.");
    await new Promise((resolve) => setTimeout(resolve, 850));

    return {
      score: 84,
      structure: [
        { slide: 'Slide 1: Title Slide', description: 'Includes tagline hook. Visual placement is good.', status: 'strong' },
        { slide: 'Slide 2: Scenario', description: 'Bullet density is high. Suggest shortening.', status: 'weak' }
      ],
      weakSlides: ['Slide 2: Too many redundant sentences.'],
      strongSlides: ['Slide 1: Clear tagline hook.'],
      tips: ['Practice pacing to complete within 20 minutes.', 'Avoid saying "Next slide please" repeatedly.'],
      qaPrep: [{ question: 'How do you preserve security data?', answer: 'We compile indices client-side.' }],
      engagement: ['Ask a student feedback question at the start.']
    };
  }
}

// 6. Assignment Explainer
export async function explainAssignment(assignmentText: string): Promise<AssignmentExplanation> {
  const systemPrompt = `You are a university teaching assistant. Explain the college assignment questions and supply conceptual outlines, viva prep, and core subjects to master. Respond in a valid JSON object matching the following structure:
{
  "summary": "Relational normal forms concepts...", // string
  "presentationPoints": ["Explain normalization anomalies"], // string[]
  "vivaQuestions": [{ "question": "What is 3NF?", "answer": "Resolves transitive FDs" }],
  "importantTopics": ["Functional Dependencies"] // string[]
}
Output only the JSON.`;

  try {
    const content = await queryLLM(assignmentText, systemPrompt);
    return extractJson(content) as AssignmentExplanation;
  } catch (e) {
    // Offline Mock Fallback
    console.warn("Using Offline Mock Fallback for Assignment Explainer.");
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      summary: 'This assignment targets relational database normalization. The objective is to identify and resolve redundancies (like repeating instructor names) and anomalies up to 3NF.',
      presentationPoints: [
        'The Problem: Duplication in student course files.',
        '3NF Solution: Splitting signup columns into distinct normalized tables.'
      ],
      vivaQuestions: [
        {
          question: 'What is transitive dependency and how does it relate to 3NF?',
          answer: 'A transitive dependency occurs when a non-key attribute determines another non-key attribute. 3NF resolves this by moving the dependent attributes into a separate table.'
        }
      ],
      importantTopics: [
        'First, Second, and Third Normal Forms (1NF, 2NF, 3NF).'
      ]
    };
  }
}
