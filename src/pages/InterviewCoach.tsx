import { useState, useEffect } from 'react';
import { Mic, Sparkles, AlertCircle, CheckCircle, ArrowLeft, Lock, Play, CircleDot, Volume2, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeInterviewAnswer } from '../lib/aiMock';
import type { InterviewFeedback } from '../lib/aiMock';

const SAMPLE_ANSWER = "I worked on a school project where we had to write code in python. It was kind of hard because some team members didn't do much, so I had to do a lot of the work myself. Eventually we finished it and got a decent grade, I guess.";

const CAREER_QUESTIONS: Record<string, string[]> = {
  software: [
    "Tell me about a complex coding project you built recently and the tech stack you selected.",
    "How do you optimize a slow database query or explain the time complexity of your search routine?",
    "Describe a time you had to resolve a Git merge conflict or coordinate tasks in an engineering team."
  ],
  aiml: [
    "How do you handle overfitting in a deep learning model, and what regularizations do you prefer?",
    "Explain the primary difference between gradient descent and backpropagation in neural networks.",
    "What specific metrics would you choose to evaluate a fraud-detection model's performance and why?"
  ],
  civilservices: [
    "How would you address a sudden public health crisis or resource deficit in a rural sub-division?",
    "Explain the key principles of the separation of powers under the Indian Constitution and its checks.",
    "How do you balance rapid industrial expansion with mandatory environmental conservation guidelines?"
  ],
  finance: [
    "Explain the key differences between cash flow statements and corporate profit & loss sheets.",
    "How would you conduct a Discounted Cash Flow (DCF) valuation of an Indian listed enterprise?",
    "How do GST tax filings and compliance operate for a digital e-commerce firm in India?"
  ],
  vlsi: [
    "Explain setup and hold time violations in digital circuits and how to remediate them.",
    "How do you configure a SPI or I2C serial interface to communicate with a 16-bit microcontroller?",
    "Explain the difference between blocking and non-blocking assignments in Verilog hardware modeling."
  ],
  devops: [
    "How do you troubleshoot a Kubernetes pod that is stuck in a CrashLoopBackOff state?",
    "Explain your strategy for automating infrastructure deployments using Terraform configurations.",
    "What metrics would you monitor in Prometheus to verify the health of a microservice API cluster?"
  ],
  general: [
    "Tell me about yourself, your background, and why you are interested in this specific career path.",
    "Describe a major academic or project obstacle you faced and the methodology you used to overcome it.",
    "How do you manage tight deadlines and prioritize competing tasks when working on team deliveries?"
  ]
};

export default function InterviewCoach() {
  const [activeMode, setActiveMode] = useState<'analyzer' | 'mock'>('analyzer');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<InterviewFeedback | null>(null);

  // Profile data state
  const [profile, setProfile] = useState({
    name: 'Alex Carter',
    interest: 'software',
    isPremium: false
  });

  // Mock Interview State Machine
  const [interviewState, setInterviewState] = useState<'idle' | 'speaking' | 'answering' | 'evaluating' | 'feedback' | 'completed'>('idle');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [voiceText, setVoiceText] = useState('');
  const [scores, setScores] = useState({ clarity: 0, confidence: 0, professionalism: 0 });
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');
  const [betterPhrase, setBetterPhrase] = useState<string>('');
  const [mockMistakes, setMockMistakes] = useState<string[]>([]);
  const [overallReport, setOverallReport] = useState<{ score: number; verdict: string } | null>(null);

  useEffect(() => {
    const loadProfile = () => {
      const cached = localStorage.getItem('studentproof_profile');
      const isPremiumPurchased = localStorage.getItem('studentproof_is_premium') === 'true';
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setProfile({
            name: parsed.name || 'Alex Carter',
            interest: parsed.interest || 'software',
            isPremium: isPremiumPurchased || !!parsed.isPremium
          });
        } catch {
          // ignore
        }
      } else {
        setProfile({
          name: 'Alex Carter',
          interest: 'software',
          isPremium: isPremiumPurchased
        });
      }
    };
    loadProfile();
    window.addEventListener('storage', loadProfile);
    return () => {
      window.removeEventListener('storage', loadProfile);
    };
  }, []);

  const questionsList = CAREER_QUESTIONS[profile.interest] || CAREER_QUESTIONS.general;
  const currentQuestionText = questionsList[questionIndex];

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

  // State actions for AI mock
  const startInterview = () => {
    setQuestionIndex(0);
    setVoiceText('');
    setOverallReport(null);
    setInterviewState('speaking');
  };

  const handleFinishSpeaking = () => {
    setInterviewState('answering');
  };

  const submitAnswer = async () => {
    if (!voiceText.trim()) return;
    setInterviewState('evaluating');

    try {
      const data = await analyzeInterviewAnswer(voiceText);
      
      // Accumulate scores for average in the end
      setScores(prev => ({
        clarity: prev.clarity + data.clarity,
        confidence: prev.confidence + data.confidence,
        professionalism: prev.professionalism + data.professionalism
      }));

      setFeedbackNotes(data.suggestions.join('. ') || 'Keep working on structuring with the STAR framework.');
      setBetterPhrase(data.betterVersion);
      setMockMistakes(data.mistakes);
      setInterviewState('feedback');
    } catch {
      setFeedbackNotes('Good draft. Focus on structural metrics.');
      setBetterPhrase('In my last project, we deployed database indexes, improving speed by 30%.');
      setMockMistakes(['Missing quantitative metrics']);
      setInterviewState('feedback');
    }
  };

  const nextQuestion = () => {
    if (questionIndex < questionsList.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setVoiceText('');
      setInterviewState('speaking');
    } else {
      // Calculate average final scores
      const count = questionsList.length;
      const avgClarity = Math.round(scores.clarity / count);
      const avgConfidence = Math.round(scores.confidence / count);
      const avgProf = Math.round(scores.professionalism / count);
      const finalScore = Math.round((avgClarity + avgConfidence + avgProf) / 3);

      let verdict = 'Good placement readiness. Focus on detailing system limits.';
      if (finalScore >= 80) verdict = 'Excellent readiness! Highly articulate and structure-perfect.';
      else if (finalScore < 60) verdict = 'Requires preparation. practice structuring responses using action verbs.';

      setOverallReport({
        score: finalScore,
        verdict
      });
      setInterviewState('completed');
    }
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
            setInterviewState('idle');
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
        <div className="max-w-3xl mx-auto">
          {/* Locked State if not Premium */}
          {!profile.isPremium ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-md max-w-xl mx-auto">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-900/30">
                <Lock className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">🔒 Interactive AI Voice Mock Interview</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Practice talking with Priya, our conversational AI recruiter. She will conduct the interview, analyze your audio drafts, and ask dynamic follow-up questions tailored to your profile.
                </p>
              </div>
              
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  to="/pricing"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-3 rounded-lg transition-all shadow-sm"
                >
                  Upgrade to Premium
                </Link>
                <Link
                  to="/profile"
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs px-5 py-3 rounded-lg transition-all"
                >
                  Unlock in Profile Settings (Demo)
                </Link>
              </div>
            </div>
          ) : (
            /* Premium Call Dashboard */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden min-h-[450px] flex flex-col">
              
              {/* Call Header */}
              <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">AI Screen Call Active</span>
                </div>
                <div className="text-xs text-slate-400">
                  Target: <span className="font-semibold text-indigo-400 uppercase">{profile.interest}</span>
                </div>
              </div>

              {/* Core Call Interface Area */}
              <div className="flex-1 p-6 flex flex-col justify-center items-center space-y-6">
                
                {/* 1. IDLE STATE */}
                {interviewState === 'idle' && (
                  <div className="text-center space-y-6 max-w-sm">
                    <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-indigo-500/10 border border-indigo-500/20" />
                      <img
                        className="w-24 h-24 rounded-full border-2 border-indigo-500/40 relative z-10"
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
                        alt="Interviewer Face"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">Priya — Technical Recruiter</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Hi {profile.name}, I will be conducting your 3-question placement screening loop today.</p>
                    </div>
                    <button
                      onClick={startInterview}
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-3 rounded-lg transition-all shadow-md shadow-indigo-600/10"
                    >
                      <Play className="h-4 w-4" /> Start Interview Loop
                    </button>
                  </div>
                )}

                {/* 2. SPEAKING STATE */}
                {interviewState === 'speaking' && (
                  <div className="text-center space-y-6 max-w-md w-full">
                    {/* Pulsating Wave Avatar */}
                    <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                      <div className="absolute -inset-2 rounded-full bg-indigo-500/15 animate-pulse" />
                      <img
                        className="w-24 h-24 rounded-full border-2 border-indigo-500 relative z-10"
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
                        alt="Interviewer Face"
                      />
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex justify-center items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider mb-2">
                        <Volume2 className="h-4 w-4" /> Priya is speaking...
                      </div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed italic">
                        "{currentQuestionText}"
                      </p>
                    </div>
                    <button
                      onClick={handleFinishSpeaking}
                      className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-all shadow-sm"
                    >
                      <Mic className="h-4 w-4" /> Unmute to Respond
                    </button>
                  </div>
                )}

                {/* 3. ANSWERING STATE */}
                {interviewState === 'answering' && (
                  <div className="w-full max-w-md space-y-5">
                    <div className="text-center space-y-3">
                      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/20" />
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center relative z-10">
                          <Mic className="h-7 w-7 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        <CircleDot className="h-3.5 w-3.5 animate-ping text-red-500" /> Recording Response...
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Speak / Type your response:</label>
                      <textarea
                        placeholder="State your answer. Frame it around Situation, Task, Action, and specific metrics (Result)..."
                        rows={4}
                        value={voiceText}
                        onChange={(e) => setVoiceText(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-sans"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setInterviewState('speaking')}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs py-2.5 rounded-lg transition-colors"
                      >
                        Listen Again
                      </button>
                      <button
                        onClick={submitAnswer}
                        disabled={!voiceText.trim()}
                        className="flex-1 inline-flex justify-center items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 font-semibold text-xs py-2.5 rounded-lg transition-colors text-white shadow-sm"
                      >
                        Submit Response
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. EVALUATING STATE */}
                {interviewState === 'evaluating' && (
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto" />
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">Priya is evaluating your phrasing structure...</h4>
                    <p className="text-xs text-slate-400">Comparing details with standard STAR requirements...</p>
                  </div>
                )}

                {/* 5. FEEDBACK STATE */}
                {interviewState === 'feedback' && (
                  <div className="w-full max-w-lg space-y-5">
                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-slate-200">
                        <img
                          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=80&h=80"
                          alt="Interviewer Face"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Priya's Feedback (Question #{questionIndex + 1})</h4>
                        <p className="text-[10px] text-slate-400">Response analyzed in real-time</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Key Suggestions */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Coaching Tip</span>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-lg border border-slate-100 dark:border-slate-850 leading-relaxed font-sans font-medium">
                          {feedbackNotes}
                        </p>
                      </div>

                      {/* Mistakes */}
                      {mockMistakes.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">Areas to avoid</span>
                          <div className="flex flex-wrap gap-2">
                            {mockMistakes.map((mistake, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 text-[10px] bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/20">
                                <AlertCircle className="h-3 w-3" />
                                {mistake}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Better Phrasing */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">Optimized Phrasing Suggestion</span>
                        <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-900 leading-relaxed font-mono italic">
                          "{betterPhrase}"
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={nextQuestion}
                      className="w-full inline-flex justify-center items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                      {questionIndex < questionsList.length - 1 ? 'Proceed to Next Question' : 'Complete Interview & View Grades'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* 6. COMPLETED STATE */}
                {interviewState === 'completed' && overallReport && (
                  <div className="w-full max-w-md space-y-6 text-center py-4">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900/30">
                      <CheckCircle className="h-8 w-8" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">Mock Interview Loop Finished</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        You completed the 3 screening questions for target career role: <strong className="uppercase text-indigo-600 dark:text-indigo-400">{profile.interest}</strong>.
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950/50 p-5 border border-slate-100 dark:border-slate-850 rounded-xl space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Overall Placement Readiness Grade</span>
                        <div className="text-4xl font-display font-black text-indigo-600 dark:text-indigo-400 mt-1">
                          {overallReport.score}%
                        </div>
                      </div>
                      <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-sans">
                        {overallReport.verdict}
                      </p>
                    </div>

                    <button
                      onClick={startInterview}
                      className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-3 rounded-lg transition-colors shadow-sm"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Restart Placement Mock
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
