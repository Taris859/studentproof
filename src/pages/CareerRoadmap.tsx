import { useState } from 'react';
import { Map, Sparkles, Clock, BookOpen, Layers, Award, Terminal } from 'lucide-react';

type TrackId = 'software' | 'cyber' | 'data' | 'uiux' | 'pm' | 'marketing' | 'writing';

interface RoadmapTrack {
  title: string;
  timeline: string;
  skills: string[];
  courses: string[];
  projects: string[];
  certs: string[];
  interviewPrep: string[];
}

const TRACKS: Record<TrackId, RoadmapTrack> = {
  software: {
    title: 'Software Engineer',
    timeline: '6–9 Months',
    skills: ['Git & GitHub', 'JavaScript & TypeScript', 'React & Next.js', 'REST APIs', 'Node.js & Databases (SQL/NoSQL)', 'DSA & System Design'],
    courses: [
      'Frontend Foundations (HTML/CSS Flexbox/TypeScript)',
      'Backend Engineering (APIs, Server frameworks, Database queries)',
      'Data Structures & Algorithms (Sorting, Search, Dynamic Programming)'
    ],
    projects: [
      'Interactive Dashboard (React + LocalStorage persistence)',
      'E-commerce RESTful API (Node, Express, relational SQL schema)',
      'Real-time Chat App (WebSockets for message sync)'
    ],
    certs: [
      'AWS Certified Developer - Associate',
      'Meta Front-End Developer Professional Certificate'
    ],
    interviewPrep: [
      'Leetcoding practice (Easy/Medium array and hash questions)',
      'Behavioral STAR stories focused on team projects',
      'System design mock questions (URL shortener, News feed)'
    ]
  },
  cyber: {
    title: 'Cybersecurity Analyst',
    timeline: '8–12 Months',
    skills: ['Linux Administration', 'Networking Protocols (TCP/IP)', 'Wireshark packet analysis', 'Ethical Hacking', 'SIEM Tools (Splunk)', 'Cryptography'],
    courses: [
      'Network Security Foundations (Subnetting, VPNs, Firewalls)',
      'Security Operations Center (SOC) Analyst training',
      'Ethical Hacking & Penetration Testing'
    ],
    projects: [
      'Vulnerability Assessment (Scanning and patching a mock network)',
      'Custom Python packet sniffer script',
      'SIEM Dashboard (Monitoring mock server logs for threats)'
    ],
    certs: [
      'CompTIA Security+',
      'Certified Ethical Hacker (CEH)',
      'Google Cybersecurity Professional Certificate'
    ],
    interviewPrep: [
      'Reviewing port numbers and protocol mechanisms',
      'Explaining remediation steps for cross-site scripting (XSS)',
      'Incident Response hypothetical scenarios walkthrough'
    ]
  },
  data: {
    title: 'Data Analyst',
    timeline: '5–8 Months',
    skills: ['Python (Pandas/NumPy)', 'SQL queries & joins', 'Excel Pivot Tables', 'Tableau & PowerBI dashboards', 'Statistical Hypothesis Testing'],
    courses: [
      'SQL for Business Intelligence & Advanced Joins',
      'Data Manipulation using Python Pandas',
      'Visualizing Datasets in PowerBI'
    ],
    projects: [
      'Sales analytics cohort dashboard (Tableau)',
      'Customer churn analysis script (Jupyter Notebook)',
      'Automated scraper gathering housing prices (Python)'
    ],
    certs: [
      'Google Data Analytics Professional Certificate',
      'Microsoft Certified: Power BI Data Analyst'
    ],
    interviewPrep: [
      'SQL query tests (joins, window functions, group-by)',
      'Explaining data cleaning steps for missing values',
      'A/B testing statistical significance calculations'
    ]
  },
  uiux: {
    title: 'UI/UX Designer',
    timeline: '4–6 Months',
    skills: ['Figma Layouts & Prototyping', 'Wireframing', 'User Research methods', 'Information Architecture', 'Design System creation'],
    courses: [
      'Figma Masterclass (Components, Auto-Layout, Variables)',
      'UX Research & Persona formulation',
      'Interaction Design & Micro-animations'
    ],
    projects: [
      'Redesign of a local college portal (Case Study)',
      'Mobile delivery application wireframe and test prototype',
      'Design System library for an open-source framework'
    ],
    certs: [
      'Google UX Design Professional Certificate',
      'Interaction Design Foundation (IxDF) Certification'
    ],
    interviewPrep: [
      'Portfolio review walkthrough (Explaining user problem, research, iterations)',
      'Design critique exercise (Analyzing a popular app\'s layout)',
      'Figma workflow speed run test'
    ]
  },
  pm: {
    title: 'Product Manager',
    timeline: '6–8 Months',
    skills: ['Agile / Scrum framework', 'Market Research & Competitor grids', 'Jira / Linear tracking', 'Product Spec (PRD) writing', 'Metrics & KPI setting'],
    courses: [
      'Product Management 101 (Ideation, PRDs, Roadmap mapping)',
      'Agile Product Delivery & User Story writing',
      'Product Analytics (Amplitude, Google Analytics)'
    ],
    projects: [
      'Product Requirement Document (PRD) for a new Slack feature',
      'Competitor analysis audit & teardown (Linear vs. Jira)',
      'User feedback survey analysis & feature roadmap proposal'
    ],
    certs: [
      'Certified Scrum Product Owner (CSPO)',
      'AIPMM Certified Product Manager'
    ],
    interviewPrep: [
      'Product estimation questions ("Estimate the number of cars in Delhi")',
      'Product improvement scenarios ("How would you improve Google Maps for students?")',
      'Prioritization frameworks (RICE, MoSCoW) applications'
    ]
  },
  marketing: {
    title: 'Digital Marketer',
    timeline: '4–6 Months',
    skills: ['SEO Optimization', 'Google Ads campaigns', 'Social Media Analytics', 'Copywriting', 'Email Marketing (Mailchimp)'],
    courses: [
      'SEO audit and organic ranking masterclass',
      'Pay-Per-Click (PPC) and Search Ads Setup',
      'Email drip campaign architecture'
    ],
    projects: [
      'SEO audit case study of a local retail site',
      'Google Ads simulated campaign structure & spend report',
      'Email marketing newsletter funnel design'
    ],
    certs: [
      'Google Ads Certification',
      'HubSpot Inbound Marketing Certification'
    ],
    interviewPrep: [
      'Discussing Customer Acquisition Cost (CAC) and Lifetime Value (LTV)',
      'Explaining how you would design an A/B test for an ad copy',
      'Describing key metrics to track on social media campaigns'
    ]
  },
  writing: {
    title: 'Content Writer',
    timeline: '3–5 Months',
    skills: ['SEO Copywriting', 'Blog formatting', 'Technical documentation', 'Proofreading', 'Content management systems (WordPress)'],
    courses: [
      'SEO Copywriting & Keyword intent analysis',
      'Technical writing guidelines (Simplified explanations, API documentation)',
      'Content editing and proofreading frameworks'
    ],
    projects: [
      'Portfolio blog containing 5 optimized articles',
      'API documentation guide for a simple backend endpoint',
      'Case study summary detailing a software feature launch'
    ],
    certs: [
      'HubSpot Content Marketing Certification',
      'Technical Writing Certification by Google'
    ],
    interviewPrep: [
      'Providing writing samples tailored for different reader personas',
      'Explaining how you outline complex technical features for non-technical users',
      'Describing your editing process'
    ]
  }
};

export default function CareerRoadmap() {
  const [selectedTrack, setSelectedTrack] = useState<TrackId>('software');
  const track = TRACKS[selectedTrack];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Map className="h-5 w-5 text-indigo-500" />
            AI Career Roadmap Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select your target career goal. Instantly customize a step-by-step training track, recommended projects, and interview topics.
          </p>
        </div>
      </div>

      {/* Track Selector Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl flex flex-wrap gap-1.5 shadow-sm">
        {(Object.keys(TRACKS) as TrackId[]).map((id) => (
          <button
            key={id}
            onClick={() => setSelectedTrack(id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTrack === id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {TRACKS[id].title}
          </button>
        ))}
      </div>

      {/* Main Track Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Overview & Skills */}
        <div className="space-y-6">
          {/* Overview card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Goal Profile</span>
            </div>
            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">{track.title}</h3>
            
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Est. Timeline: <strong className="text-slate-800 dark:text-slate-200">{track.timeline}</strong></span>
            </div>
          </div>

          {/* Skills Required Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Terminal className="h-4 w-4 text-indigo-500" /> Key Skills Required
            </h4>
            <div className="flex flex-wrap gap-2">
              {track.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full border border-indigo-100 dark:border-indigo-900/40"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Courses, Projects, Certs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Courses & Training Roadmap */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <BookOpen className="h-4 w-4 text-indigo-500" /> Suggested Course Syllabus
            </h4>
            <div className="space-y-4">
              {track.courses.map((course, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{course}</p>
                    <p className="text-xs text-slate-400">Available via common online MOOC programs.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects to Build */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Layers className="h-4 w-4 text-indigo-500" /> Recommended Projects
            </h4>
            <div className="space-y-4">
              {track.projects.map((proj, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-900 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase">Project #{idx + 1}</span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{proj}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Build this to demonstrate technical execution on your portfolio resume.</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications and Interview Prep */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certifications */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Award className="h-4 w-4 text-indigo-500" /> Certifications
              </h4>
              <ul className="space-y-3">
                {track.certs.map((c, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Interview Prep */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Map className="h-4 w-4 text-indigo-500" /> Prep Topics
              </h4>
              <ul className="space-y-3">
                {track.interviewPrep.map((ip, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                    {ip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
