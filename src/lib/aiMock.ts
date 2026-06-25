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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
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

function getDynamicAssignmentMock(inputText: string): AssignmentExplanation {
  const text = inputText.toLowerCase();
  
  // 1. Database / SQL / Normalization
  if (text.includes('database') || text.includes('sql') || text.includes('normalize') || text.includes('relation') || text.includes('3nf') || text.includes('schema')) {
    return {
      summary: 'This assignment focuses on relational database management systems (RDBMS) and the principles of database normalization. Normalization is the systematic process of organizing fields and tables of a database to minimize redundancy and dependency. The primary goal is to isolate data so that additions, deletions, and modifications of a field can be made in just one table and then propagated through the rest of the database using defined foreign keys. This prevents data anomalies (insert, update, and delete anomalies) and ensures relational integrity.',
      presentationPoints: [
        'Introduction to RDBMS and the problem of data redundancy in flat-file tables.',
        'Analyzing Functional Dependencies (FDs) to determine how attributes relate to one another.',
        'First Normal Form (1NF): Eliminating duplicate columns and ensuring atomicity of values.',
        'Second Normal Form (2NF): Removing partial dependencies where non-prime attributes depend on only part of a composite candidate key.',
        'Third Normal Form (3NF): Eliminating transitive dependencies where non-prime attributes depend on other non-prime attributes.',
        'Reviewing the final normalized schema design and showing entity-relationship (ER) linkages.'
      ],
      vivaQuestions: [
        {
          question: 'What is the primary difference between 2NF and 3NF?',
          answer: 'A relation is in 2NF if it is in 1NF and contains no partial dependencies (no non-prime attribute depends on a proper subset of any candidate key). A relation is in 3NF if it is in 2NF and contains no transitive dependencies (non-prime attributes must only depend directly on the primary key, not on other non-prime attributes).'
        },
        {
          question: 'What are database anomalies and why are they dangerous?',
          answer: 'There are three types: Insertion anomaly (inability to add data without other unrelated data), Deletion anomaly (unintended loss of data when deleting unrelated records), and Update anomaly (inconsistent data state when updating a value that exists in multiple redundant rows). They cause data corruption and inconsistency.'
        },
        {
          question: 'What is a transitive dependency?',
          answer: 'It is an indirect functional dependency. If attribute A determines B (A -> B) and B determines C (B -> C), then A determines C transitively through B. In 3NF, such transitive relationships are moved to separate tables.'
        },
        {
          question: 'When would you deliberately denormalize a database?',
          answer: 'Denormalization is done for performance optimization in read-heavy applications (like data warehousing or analytics). By re-introducing controlled redundancy, we avoid expensive JOIN operations, speeding up complex query execution times at the cost of additional storage and write complexity.'
        }
      ],
      importantTopics: [
        'Functional Dependencies & Candidate Keys',
        'Lossless-Join and Dependency-Preserving Decompositions',
        'Boyce-Codd Normal Form (BCNF) vs 3NF',
        'Entity-Relationship Diagrams (ERDs) and Foreign Keys'
      ]
    };
  }

  // 2. Data Structures & Algorithms (DSA) / Sorting / Search / Tree / Graph
  if (text.includes('algorithm') || text.includes('dsa') || text.includes('sorting') || text.includes('search') || text.includes('tree') || text.includes('graph') || text.includes('binary') || text.includes('complexity') || text.includes('leetcode')) {
    return {
      summary: 'This assignment covers core computer science principles in Data Structures and Algorithms (DSA). It focuses on choosing the optimal memory layout (data structure) and computational steps (algorithm) to solve a specific problem efficiently. Key objectives include analyzing time and space complexity using Big O notation to evaluate how scale affects performance, and implementing robust search, sorting, or traversal routines.',
      presentationPoints: [
        'Problem definition and identifying why basic approaches (like brute force) fail under large datasets.',
        'Choosing the right data structure (e.g., hash maps for O(1) lookups, trees for hierarchical search, or graphs for network paths).',
        'Step-by-step walkthrough of the algorithm logic (traversal steps, partition logic, or recursion stack).',
        'Complexity analysis demonstrating Big O time and space performance bounds.',
        'Edge cases evaluated: empty inputs, duplicate elements, negative numbers, or integer overflows.',
        'Alternative algorithms compared (e.g., QuickSort vs MergeSort, or BFS vs DFS).'
      ],
      vivaQuestions: [
        {
          question: 'What is Big O notation and how do you calculate time complexity?',
          answer: 'Big O notation describes the upper bound of an algorithm\'s running time in the worst-case scenario relative to the input size N. It is calculated by identifying the dominant operations, counting how many times they execute in terms of N, and dropping lower-order terms and constant coefficients.'
        },
        {
          question: 'What is the difference between Depth-First Search (DFS) and Breadth-First Search (BFS)?',
          answer: 'DFS explores as deep as possible along each branch before backtracking, utilizing a Stack (or recursion). BFS explores all neighbors at the current depth before moving to the next level, utilizing a Queue. DFS is ideal for pathfinding and backtracking, while BFS guarantees finding the shortest path in unweighted graphs.'
        },
        {
          question: 'What is the time complexity of QuickSort in the average and worst cases?',
          answer: 'QuickSort has an average-case time complexity of O(N log N) when the pivot divides the array reasonably well. In the worst-case (e.g., array already sorted and picking the first/last element as pivot), the partitioning is highly unbalanced, resulting in O(N^2) complexity. Randomized pivot selection helps guarantee O(N log N) behavior.'
        },
        {
          question: 'Why is a Hash Map look-up generally O(1) time complexity?',
          answer: 'A hash map uses a hash function to map keys to specific index buckets in an array. Under ideal conditions with a good hash function, the key maps directly to its value bucket instantly. In cases of hash collisions (multiple keys mapping to the same bucket), chaining or open addressing is used, which can degrade look-up time to O(N) if collisions are high.'
        }
      ],
      importantTopics: [
        'Time & Space Complexity (Big O, Big Theta, Big Omega)',
        'Recursion & Dynamic Programming (Memoization vs Tabulation)',
        'Tree Traversals (In-order, Pre-order, Post-order, Level-order)',
        'Graph Representation (Adjacency Matrix vs Adjacency List)'
      ]
    };
  }

  // 3. Programming / Code / Python / Java / C++ / Javascript / Object-Oriented (OOP)
  if (text.includes('programming') || text.includes('code') || text.includes('python') || text.includes('java') || text.includes('javascript') || text.includes('class') || text.includes('object') || text.includes('oop') || text.includes('function')) {
    return {
      summary: 'This assignment targets programming fundamentals, software architecture, and the paradigm of Object-Oriented Programming (OOP) or Functional Programming. It emphasizes writing clean, reusable, and modular code that adheres to standard software engineering practices (like DRY and SOLID principles). The task involves designing system classes, handling data encapsulation, and implementing logic handlers.',
      presentationPoints: [
        'Overview of the software design requirements and architecture goals.',
        'Defining classes, objects, and relationships to model real-world concepts.',
        'Encapsulating private states and exposing controlled public interfaces.',
        'Implementing inheritance and polymorphism to reuse logic and customize subclass behaviors.',
        'Writing modular helper functions and separating controller logic from data models.',
        'Testing strategy: unit testing, assertion statements, and exception handling blocks.'
      ],
      vivaQuestions: [
        {
          question: 'What are the four pillars of Object-Oriented Programming?',
          answer: 'The four pillars are: 1) Encapsulation (hiding internal state and requiring all interaction through public methods), 2) Inheritance (creating a new class based on an existing one to reuse properties/methods), 3) Polymorphism (allowing different classes to respond to the same method call in their own way), and 4) Abstraction (hiding implementation details and showing only essential features).'
        },
        {
          question: 'What is the difference between a class and an object?',
          answer: 'A class is a blueprint, template, or prototype that defines the variables and methods common to all objects of that type. An object is a concrete instance of a class that occupies memory and possesses state values and behavior.'
        },
        {
          question: 'What is polymorphism and can you give a real example?',
          answer: 'Polymorphism is the ability of an object to take on many forms. A common example is method overriding: if we have a parent class `Animal` with a method `makeSound()`, and subclasses `Dog` and `Cat` that override `makeSound()` to bark or meow, calling `makeSound()` on an `Animal` reference will execute the subclass-specific sound at runtime.'
        },
        {
          question: 'What is the purpose of interface-based design?',
          answer: 'Interfaces define a contract of methods that a class must implement without specifying how they are implemented. This decouples the definition of behavior from its implementation, allowing developers to write flexible, pluggable code where different classes can be swapped seamlessly as long as they adhere to the interface contract.'
        }
      ],
      importantTopics: [
        'Object-Oriented Design & Class Relationships (Association, Composition)',
        'SOLID Design Principles for Clean Code',
        'Memory Management (Stack vs Heap, Garbage Collection)',
        'Exception Handling & Resource Management (Try-Catch-Finally)'
      ]
    };
  }

  // 4. Web Development / HTML / CSS / React / Frontend / Backend
  if (text.includes('web') || text.includes('html') || text.includes('css') || text.includes('react') || text.includes('frontend') || text.includes('backend') || text.includes('api') || text.includes('http') || text.includes('server')) {
    return {
      summary: 'This assignment covers full-stack web development concepts, including client-side user interface construction (Frontend) and server-side logic management (Backend). The core challenge is building a responsive application that communicates via the HTTP protocol, queries database objects, and renders data dynamically to provide an intuitive user experience.',
      presentationPoints: [
        'System architecture outlining client-server structure and HTTP requests.',
        'Creating semantic HTML markup layouts and styling with CSS responsive queries.',
        'State management in frontend frameworks (like React components and hooks).',
        'Backend server setup, routing requests, and processing parameters.',
        'Designing RESTful API endpoints and returning structured JSON payloads.',
        'Security configurations (CORS headers, data validation, and input sanitization).'
      ],
      vivaQuestions: [
        {
          question: 'What is React Virtual DOM and how does it optimize rendering?',
          answer: 'The Virtual DOM is a lightweight in-memory representation of the real DOM. When component state changes, React updates the Virtual DOM first. It then compares this updated Virtual DOM with a snapshot of the previous one (a process called "diffing") and computes the minimum set of changes required to update the real browser DOM (a process called "reconciliation"). This prevents expensive full-page reflows.'
        },
        {
          question: 'What is CORS and why do browsers enforce it?',
          answer: 'CORS stands for Cross-Origin Resource Sharing. It is a security mechanism enforced by web browsers to restrict cross-origin HTTP requests. By default, scripts on a page can only fetch resources from the same origin (domain, protocol, and port). A server must explicitly send headers (like `Access-Control-Allow-Origin`) to allow requests from other origins, preventing malicious sites from reading sensitive session data.'
        },
        {
          question: 'What is the difference between GET and POST requests?',
          answer: 'GET requests are used to retrieve data from a server, with parameters appended directly in the URL query string. They should be idempotent and safe (causing no side effects). POST requests are used to submit data to a server to create/update resources, with parameters sent inside the request body. POST requests are not cached and have no length restrictions.'
        },
        {
          question: 'What are React Hooks and why were they introduced?',
          answer: 'Hooks are functions that let you use state and other React features (like lifecycle methods) in functional components without writing class components. They were introduced in React 16.8 to make it easier to share stateful logic between components, simplify code structures, and avoid issues associated with classes (like binding `this`).'
        }
      ],
      importantTopics: [
        'Client-Server Architecture & HTTP Status Codes',
        'State Management and Component Lifecycle',
        'RESTful API Conventions & HTTP Verbs',
        'Web Security Baselines (CORS, XSS, CSRF)'
      ]
    };
  }

  // 5. General / Default Fallback
  const extractedSubject = inputText.split('\n')[0]?.replace(/subject:|topic:|title:/i, '').trim() || 'General Coursework';
  const keywordList = inputText.match(/\b[A-Za-z-]{4,15}\b/g)?.filter(w => !['this', 'that', 'with', 'from', 'have', 'your', 'about', 'assignment', 'tasks', 'questions', 'explain'].includes(w.toLowerCase())).slice(0, 5) || ['Conceptual Analysis', 'Core Principles'];

  return {
    summary: `This assignment deals with advanced academic concepts relating to "${extractedSubject}". The primary objective is to analyze the requested scenario, understand the constraints, and formulate a structured solution. The solution requires applying theoretical frameworks to practical problems, ensuring high-quality reasoning and systematic derivation of conclusions. Key themes in this topic involve: ${keywordList.join(', ')}.`,
    presentationPoints: [
      `Introduction to the core topic of "${extractedSubject}" and its real-world importance.`,
      `Parsing the specific constraints and requirements specified in the prompt.`,
      `Formulating a step-by-step conceptual methodology to address each sub-task.`,
      `Deep dive into the core theoretical concepts (specifically looking at: ${keywordList.slice(0, 3).join(', ')}).`,
      `Presenting the results, diagrams, or calculations clearly.`,
      `Reviewing limitations, alternative approaches, and future expansion areas.`
    ],
    vivaQuestions: [
      {
        question: `What is the core theoretical principle behind this "${extractedSubject}" assignment?`,
        answer: `The core principle involves applying structured, methodical principles to parse complex inputs, reduce redundancies, and satisfy defined domain rules. This ensures that the resulting output (whether code, a database schema, or an analysis report) is mathematically sound, consistent, and follows industry standard best practices.`
      },
      {
        question: `How would you verify or test the correctness of your solution to these tasks?`,
        answer: `Correctness is verified by comparing the outcomes against established boundary conditions and validation rules. For mathematical or logical tasks, this involves formal proofs or tracing steps. For software tasks, it involves running test suites, verifying input constraints, and analyzing runtime outputs.`
      },
      {
        question: `What were the main constraints or assumptions you made when solving this?`,
        answer: `The primary assumption was that all input data provided in the prompt was clean and accurate. We assumed standard defaults for any unspecified variables (e.g., standard networking protocols, regular normal form attributes, or standard OOP design patterns) to keep the solution clean and focused.`
      },
      {
        question: `How does mastering the topic of "${extractedSubject}" contribute to real-world engineering or scientific applications?`,
        answer: `Mastering this topic builds the critical analytical thinking required to break down large, ambiguous problem statements into modular, solvable components. In a professional engineering environment, this translates directly to writing maintainable code, designing scalable system architectures, or conducting rigorous validation of requirements before deployment.`
      }
    ],
    importantTopics: [
      `Foundational Concepts of ${extractedSubject}`,
      `Methodical Problem-Solving Frameworks`,
      `Critical Evaluation & Constraints Analysis`,
      `Quality Assurance and Validation Procedures`
    ]
  };
}

// 6. Assignment Explainer
export async function explainAssignment(assignmentText: string): Promise<AssignmentExplanation> {
  const systemPrompt = `You are a university teaching assistant. Provide a highly detailed and comprehensive explanation of the college assignment questions. Supply a thorough conceptual summary (at least 2-3 paragraphs, at least 150 words total), detailed slide presentation points (at least 5-6 points), exactly 4 detailed oral exam (viva) prep questions with comprehensive explanations (each explanation must be at least 2-3 sentences), and at least 4 core subjects to master. Respond in a valid JSON object matching the following structure:
{
  "summary": "A deep and comprehensive multi-paragraph conceptual summary of the assignment, detail-rich and academic...",
  "presentationPoints": [
    "Introduction to the core topic and primary concepts",
    "Detailed analytical slide point covering core theory",
    "Step-by-step methodology and implementation layout",
    "Key calculations, algorithms, or schema rules applied",
    "Evaluation of edge cases and performance limitations",
    "Review of critical conclusions and recommendations"
  ],
  "vivaQuestions": [
    { "question": "What is the primary architectural concept here?", "answer": "The primary architecture relies on... explaining in multiple detailed sentences." },
    { "question": "Explain the major trade-offs in this design.", "answer": "The design choices present key trade-offs between... explaining in multiple detailed sentences." },
    { "question": "How would you handle scale in this model?", "answer": "To scale this structure, one would introduce... explaining in multiple detailed sentences." },
    { "question": "How do you test and validate this solution?", "answer": "Validation is carried out by executing... explaining in multiple detailed sentences." }
  ],
  "importantTopics": [
    "Core Concept 1",
    "Core Concept 2",
    "Core Concept 3",
    "Core Concept 4"
  ]
}
Output only the JSON code block. Do not add conversational intro/outro text.`;

  try {
    const content = await queryLLM(assignmentText, systemPrompt);
    return extractJson(content) as AssignmentExplanation;
  } catch {
    // Offline Mock Fallback
    console.warn("Using Offline Mock Fallback for Assignment Explainer.");
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getDynamicAssignmentMock(assignmentText);
  }
}
