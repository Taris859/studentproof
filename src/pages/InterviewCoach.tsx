import { useState } from 'react';
import { Mic, Sparkles, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { analyzeInterviewAnswer } from '../lib/aiMock';
import type { InterviewFeedback } from '../lib/aiMock';

const SAMPLE_ANSWER = "I worked on a school project where we had to write code in python. It was kind of hard because some team members didn't do much, so I had to do a lot of the work myself. Eventually we finished it and got a decent grade, I guess.";

const MOCK_QUESTIONS = [
  { id: 1, text: "Tell me about yourself and your background.", category: "Introduction" },
  { id: 2, text: "Describe a time you had to resolve a conflict within a team.", category: "Behavioral" },
  { id: 3, text: "Why are you interested in this internship role?", category: "Motivation" },
  { id: 4, text: "Explain a complex technical project you built recently.", category: "Technical" },
  { id: 5, text: "How do you prioritize tasks when working under tight deadlines?", category: "Behavioral" },
  { id: 6, text: "Tell me about a time you failed and what you learned from it.", category: "Behavioral" },
  { id: 7, text: "What is your experience working with Version Control (Git)?", category: "Technical" },
  { id: 8, text: "How do you handle feedback or criticism from a supervisor?", category: "Behavioral" },
  { id: 9, text: "What do you know about our company's mission or products?", category: "Motivation" },
  { id: 10, text: "Where do you see yourself professionally in the next three years?", category: "Introduction" }
];

export default function InterviewCoach() {
  const [activeMode, setActiveMode] = useState<'analyzer' | 'mock'>('analyzer');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<InterviewFeedback | null>(null);

  // Mock state for selected question in Mock Interview Mode
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);
  const [mockResponseText, setMockResponseText] = useState('');
  const [mockFeedback, setMockFeedback] = useState<string | null>(null);

  const handleAnalyzeAnswer = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) return;
    setLoading(true);

    try {
      const data = await analyzeInterviewAnswer(textToAnalyze);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMockSubmit = () => {
    if (!mockResponseText.trim()) return;
    setLoading(true);
    setMockFeedback(null);
    setTimeout(() => {
      setMockFeedback(
        `Good start! Your answer targets the core scenario. Tip: Try to quantify the results. If you solved a conflict or launched a tool, explain the specific outcomes (e.g. 'boosted engagement by 20%'). Keep practicing!`
      );
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Mic className="h-5 w-5 text-indigo-500" />
          AI Interview Coach
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Practice interview answers or select common questions. Get graded on confidence, structure, and professional phrasing.
        </p>
      </div>

      {/* Tabs Mode */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-px">
        <button
          onClick={() => {
            setActiveMode('analyzer');
            setReport(null);
            setAnswer('');
          }}
          className={`pb-2.5 px-4 font-display font-bold text-sm border-b-2 transition-all ${
            activeMode === 'analyzer'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Answer Evaluator
        </button>
        <button
          onClick={() => {
            setActiveMode('mock');
            setMockFeedback(null);
            setMockResponseText('');
          }}
          className={`pb-2.5 px-4 font-display font-bold text-sm border-b-2 transition-all ${
            activeMode === 'mock'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Mock Interview Mode
        </button>
      </div>

      {/* Mode 1: Answer Evaluator */}
      {activeMode === 'analyzer' && (
        <div className="space-y-6">
          {!report && !loading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Paste your interview answer draft:</label>
                <button
                  onClick={() => setAnswer(SAMPLE_ANSWER)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  Use Weak Sample Answer
                </button>
              </div>

              <textarea
                placeholder="E.g., In my last coding assignment, I led the setup of the repository..."
                rows={6}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-sans"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => handleAnalyzeAnswer(answer)}
                  disabled={!answer.trim()}
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 font-medium text-xs px-4 py-2.5 rounded-lg transition-colors text-white shadow-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  Evaluate Phrasing
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-4 shadow-sm min-h-[250px] flex flex-col justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400" />
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Analyzing Phrasing & Leadership Traits...</h4>
              <p className="text-xs text-slate-400">Scanning for negative collaboration verbs and filler words...</p>
            </div>
          )}

          {/* Report Display */}
          {report && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setReport(null)}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Evaluate Another Answer
                </button>
              </div>

              {/* Scores Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Clarity Score', val: report.clarity, color: 'text-indigo-600 dark:text-indigo-400' },
                  { label: 'Confidence Grade', val: report.confidence, color: 'text-blue-600 dark:text-blue-400' },
                  { label: 'Professionalism', val: report.professionalism, color: 'text-amber-600 dark:text-amber-400' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl text-center shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                    <h3 className={`text-3xl font-display font-black ${stat.color}`}>{stat.val}%</h3>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2 mx-auto max-w-[120px]">
                      <div className="h-full bg-indigo-600" style={{ width: `${stat.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions vs Mistakes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Key Suggestions
                  </h4>
                  <ul className="space-y-3">
                    {report.suggestions.map((s, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" /> Mistakes Spotted
                  </h4>
                  <ul className="space-y-3">
                    {report.mistakes.map((m, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Improved version comparison card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-500" /> Suggested STAR Phrasing
                </h4>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic font-mono">
                  "{report.betterVersion}"
                </div>
              </div>

              {/* Follow-up Questions */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Potential Recruiter Follow-ups</h4>
                <p className="text-xs text-slate-500">Based on your answer draft, expect these queries next:</p>
                <div className="space-y-2.5 pt-1.5">
                  {report.followUps.map((f, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 border border-slate-100 dark:border-slate-900 rounded-lg">
                      <span className="font-bold text-indigo-500 font-display">Q:</span>
                      <span>"{f}"</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Mock Interview Mode */}
      {activeMode === 'mock' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Questions Navigation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-3 block pb-2">Questions Deck</span>
            {MOCK_QUESTIONS.map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  setSelectedQuestionId(q.id);
                  setMockResponseText('');
                  setMockFeedback(null);
                }}
                className={`w-full text-left px-3 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-start justify-between gap-2 ${
                  selectedQuestionId === q.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="line-clamp-1">{q.text}</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wide flex-shrink-0 font-bold ${
                  selectedQuestionId === q.id
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {q.category}
                </span>
              </button>
            ))}
          </div>

          {/* Question Practice Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Question #{selectedQuestionId}</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                "{MOCK_QUESTIONS.find((q) => q.id === selectedQuestionId)?.text}"
              </h3>

              <div className="pt-2 space-y-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Type your practice response:</label>
                <textarea
                  placeholder="Draft your answer here... try to mention a challenge, your action, and the result."
                  rows={5}
                  value={mockResponseText}
                  onChange={(e) => setMockResponseText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-sans"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setMockResponseText('');
                    setMockFeedback(null);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors border border-transparent"
                >
                  Reset
                </button>
                <button
                  onClick={handleMockSubmit}
                  disabled={!mockResponseText.trim() || loading}
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 font-medium text-xs px-4 py-2 rounded-lg transition-colors text-white shadow-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  Evaluate Prep Response
                </button>
              </div>
            </div>

            {/* Simulated Loading inside Question panel */}
            {loading && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-xl text-center shadow-sm space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto" />
                <p className="text-xs text-slate-400">Scoring performance...</p>
              </div>
            )}

            {/* Answer feedback panel */}
            {mockFeedback && !loading && (
              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/10 rounded-xl p-5 shadow-sm space-y-3">
                <h4 className="font-bold text-indigo-950 dark:text-indigo-400 text-sm flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Practice Feedback Summary
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {mockFeedback}
                </p>
                <span className="text-[10px] text-slate-400 block pt-1 border-t border-indigo-500/5">
                  Practice mode keeps track of drafts using Local Cache. Click another question to reset.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
