import { useState } from 'react';
import { Presentation, Sparkles, FileText, UploadCloud, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { analyzePresentation } from '../lib/aiMock';
import type { PresentationReport } from '../lib/aiMock';

const SAMPLE_NOTES = `Title: AI Career Copilot Launch
Slide 1: Title slide. StudentProof: From Application to Offer.
Slide 2: The Problem. College students face massive resume screens. 98% fail ATS criteria. Many fall for fake unpaid training placement scams.
Slide 3: Our Solution. StudentProof. Resume ATS grades, safety checks, tracker board.
Slide 4: Competitive Landscape. Glassdoor, LinkedIn. But they are not student-centric.
Slide 5: Pricing. Premium at 99. Pro at 199.
Slide 6: Conclusion. Thank you. Questions?`;

export default function PresentationAnalyzer() {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<PresentationReport | null>(null);

  const handleSelectSample = () => {
    setNotes(SAMPLE_NOTES);
    setFileName('studentproof_deck_v1.pdf');
  };

  const handleFileUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setNotes(`File Content Mock: [${file.name}]\nImported metadata structure parsed successfully.\nSlide notes are loaded for analysis.`);
    }
  };

  const handleAnalyze = async () => {
    if (!notes.trim()) return;
    setLoading(true);

    try {
      const data = await analyzePresentation(notes);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Presentation className="h-5 w-5 text-indigo-500" />
          AI Presentation deck Analyzer
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload your PPT/PDF slides or paste presentation notes to check design structure, verify weak slides, and prepare for Q&A loops.
        </p>
      </div>

      {!result && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* File Upload drag card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4 text-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upload Mock PPT/PDF</h3>
            
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all cursor-pointer relative flex flex-col justify-center items-center h-48">
              <UploadCloud className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Drag & drop files here</span>
              <span className="text-[10px] text-slate-400 mt-1">Files are uploaded for UI preview</span>
              <span className="text-[9px] text-amber-500 font-medium mt-1">Note: Paste notes/text below for MVP analysis. PDF parsing will be added in backend.</span>
              <input
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={handleFileUploadMock}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {fileName && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900 text-xs justify-center">
                <FileText className="h-4 w-4 text-indigo-500" />
                <span className="font-semibold truncate max-w-[150px]">{fileName}</span>
              </div>
            )}

            <button
              onClick={handleSelectSample}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 block w-full text-center"
            >
              Or load sample pitch notes
            </button>
          </div>

          {/* Notes content text area */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Presentation Script Notes</h3>
            
            <textarea
              placeholder="Paste slide outlines or notes here..."
              rows={8}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-mono"
            />

            <div className="flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={!notes.trim()}
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 font-medium text-xs px-4 py-2.5 rounded-lg transition-colors text-white shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                Run Presentation Check
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-4 shadow-sm min-h-[300px] flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400" />
          <h4 className="font-bold text-slate-800 dark:text-white text-sm">Evaluating Deck Structure...</h4>
          <p className="text-xs text-slate-400">Scanning for bullet density, visual layout balance, and pacing metrics...</p>
        </div>
      )}

      {/* Report results page */}
      {result && (
        <div className="space-y-6">
          {/* Header Action */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setResult(null);
                setFileName(null);
                setNotes('');
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Analyze Another deck
            </button>
            <span className="text-xs text-slate-400 font-display font-semibold">Deck Structure Grade: A-</span>
          </div>

          {/* Metric Overview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm text-center max-w-sm mx-auto space-y-2">
            <span className="text-xs uppercase font-bold text-slate-400">Structural Deck Score</span>
            <h3 className="text-5xl font-display font-black text-indigo-600 dark:text-indigo-400">{result.score}/100</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ideal density and slide sequencing</p>
          </div>

          {/* Slide list status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Slide-by-Slide Outline Verification</h4>
            <div className="space-y-3">
              {result.structure.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{item.slide}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide flex-shrink-0 ${
                    item.status === 'strong'
                      ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400'
                      : item.status === 'weak'
                      ? 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-400'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Strong vs Weak Slides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" /> Strong Presentation slides
              </h4>
              <ul className="space-y-3">
                {result.strongSlides.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                    {str}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Improvement Warnings
              </h4>
              <ul className="space-y-3">
                {result.weakSlides.map((weak, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                    {weak}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Q&A Prep and Delivery Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Delivery & Pacing Tips</h4>
              <ul className="space-y-3.5">
                {result.tips.map((t, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Audience Engagement Hacks</h4>
              <ul className="space-y-3.5">
                {result.engagement.map((e, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Q&A Loops */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Simulated Q&A Preparation</h4>
            <div className="space-y-4">
              {result.qaPrep.map((qa, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-900 space-y-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Q: "{qa.question}"</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-indigo-500 font-sans italic">
                    "{qa.answer}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
