import { useState } from 'react';
import { FilePlus, Sparkles, Copy, Check, ArrowLeft } from 'lucide-react';
import { generateApplication } from '../lib/aiMock';
import type { ApplicationMaterials } from '../lib/aiMock';

type Tone = 'Professional' | 'Friendly' | 'Confident';
type Tab = 'coverLetter' | 'whyHire' | 'linkedin' | 'coldEmail' | 'interviewIntro';

export default function ApplicationGenerator() {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [projects, setProjects] = useState('');
  const [tone, setTone] = useState<Tone>('Professional');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApplicationMaterials | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('coverLetter');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim() || !company.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateApplication({
        role,
        company,
        skills,
        experience,
        projects,
        tone
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToneChange = async (newTone: Tone) => {
    setTone(newTone);
    if (result) {
      setLoading(true);
      try {
        const data = await generateApplication({
          role,
          company,
          skills,
          experience,
          projects,
          tone: newTone
        });
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = result[activeTab];
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'coverLetter', label: 'Cover Letter' },
    { id: 'whyHire', label: 'Why Hire Me?' },
    { id: 'linkedin', label: 'LinkedIn Message' },
    { id: 'coldEmail', label: 'Cold Email' },
    { id: 'interviewIntro', label: 'Interview Intro' }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FilePlus className="h-5 w-5 text-indigo-500" />
          AI Application Document Generator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Input your role details and project details to draft cover letters, elevator pitches, and cold LinkedIn connection requests instantly.
        </p>
      </div>

      {!result && !loading && (
        <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">Target & Skill Inputs</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Target Role *</label>
              <input
                type="text"
                required
                placeholder="e.g. Software Engineering Intern"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Linear"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Key Skills (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. React, TypeScript, Git, Tailwind CSS"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Prior Experience</label>
              <input
                type="text"
                placeholder="e.g. Academic project Lead, Coding boot camp, None"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs sm:text-sm">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Key Highlight Project & Impact</label>
            <textarea
              placeholder="e.g. E-commerce application that optimized render speed by 15%..."
              rows={3}
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Tone Selector */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Select Writing Tone</span>
            <div className="flex gap-2">
              {(['Professional', 'Friendly', 'Confident'] as Tone[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    tone === t
                      ? 'bg-indigo-600 border-transparent text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 font-medium text-xs px-4 py-2.5 rounded-lg transition-colors text-white shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              Generate Documents
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-4 shadow-sm min-h-[300px] flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400" />
          <h4 className="font-bold text-slate-800 dark:text-white text-sm">Drafting Materials...</h4>
          <p className="text-xs text-slate-400">Formulating cover letter structure and aligning tone hooks...</p>
        </div>
      )}

      {/* Output Panel */}
      {result && (
        <div className="space-y-6">
          {/* Header Action */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => setResult(null)}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Create Different Materials
            </button>
            
            {/* Real-time tone adjustment */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Adjust Tone:</span>
              {(['Professional', 'Friendly', 'Confident'] as Tone[]).map((t) => (
                <button
                  key={t}
                  onClick={() => handleToneChange(t)}
                  className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all ${
                    tone === t
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Tabs sidebar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCopied(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Generated display field */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  {tabs.find((t) => t.id === activeTab)?.label} ({tone} Tone)
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors border border-transparent"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Text
                    </>
                  )}
                </button>
              </div>

              {/* Text Area */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900/60 rounded-xl p-4 sm:p-6">
                <pre className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {result[activeTab]}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
