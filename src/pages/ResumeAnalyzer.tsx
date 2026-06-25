import { useState } from 'react';
import { FileSearch, Sparkles, AlertCircle, CheckCircle, ArrowRight, ArrowLeft, UploadCloud, FileText, X, Loader2 } from 'lucide-react';
import { analyzeResume } from '../lib/aiMock';
import type { ResumeResult } from '../lib/aiMock';

const SAMPLE_RESUME = `Alex Carter
alexcarter@email.com | 123-456-7890
Student at State University

Education:
BS in Computer Science (Expected Grad: 2027)

Experience:
- Worked on website for local club
- Programmed python scripts
- Help desk support helper

Projects:
- Calculator application in Java
- Personal blog site`;

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<ResumeResult | null>(null);

  // Drag and drop states
  const [useTextMode, setUseTextMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const loadingSteps = [
    'Parsing resume syntax & layout...',
    'Analyzing semantic keyword frequencies...',
    'Scoring ATS formatting compatibility...',
    'Generating impact-driven bullet points...'
  ];

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setIsParsing(true);
    
    const reader = new FileReader();
    
    if (file.name.endsWith('.txt')) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setExtractedText(text);
        setIsParsing(false);
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.pdf')) {
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const typedArray = new Uint8Array(buffer);
          const decoder = new TextDecoder('utf-8');
          const raw = decoder.decode(typedArray);
          const matches = raw.match(/\(([^)]+)\)\s*T[jJ]/g);
          let extracted = '';
          if (matches) {
            extracted = matches.map(m => {
              const content = m.match(/\(([^)]+)\)/)?.[1] || '';
              return content
                .replace(/\\([0-7]{3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8)))
                .replace(/\\(.)/g, '$1');
            }).join(' ');
          } else {
            extracted = raw
              .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
              .replace(/\s+/g, ' ');
          }
          setExtractedText(extracted || `Resume PDF Content: ${file.name}`);
        } catch {
          setExtractedText(`Resume PDF Content: ${file.name}`);
        }
        setIsParsing(false);
      };
      reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith('.docx')) {
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const decoder = new TextDecoder('utf-8');
          const raw = decoder.decode(new Uint8Array(buffer));
          const matches = raw.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
          let extracted = '';
          if (matches) {
            extracted = matches.map(m => m.match(/<w:t[^>]*>([^<]+)<\/w:t>/)?.[1] || '').join(' ');
          } else {
            extracted = raw
              .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
              .replace(/\s+/g, ' ');
          }
          setExtractedText(extracted || `Resume Document Content: ${file.name}`);
        } catch {
          setExtractedText(`Resume Document Content: ${file.name}`);
        }
        setIsParsing(false);
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setExtractedText(text || `Uploaded Resume Content: ${file.name}`);
        setIsParsing(false);
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async (text: string) => {
    if (!text.trim()) return;

    setLoading(true);
    setLoadingStep(0);
    setResult(null);

    // Run visual steps
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          return prev;
        }
        return prev + 1;
      });
    }, 450);

    try {
      const data = await analyzeResume(text);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-indigo-500" />
          AI Resume Analyzer
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload your resume file or paste text to evaluate its structural score, find missing industry keywords, and rewrite bullet points.
        </p>
      </div>

      {!result && !loading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6 shadow-sm">
          {!useTextMode ? (
            /* File Upload Mode */
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
                Upload Resume Document
              </label>
              
              {selectedFile ? (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-slate-50/50 dark:bg-slate-950/20 max-w-sm mx-auto space-y-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className={`p-3 rounded-lg flex-shrink-0 ${
                      selectedFile.name.endsWith('.pdf')
                        ? 'bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                        : selectedFile.name.endsWith('.docx')
                        ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      <FileText className="h-8 w-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate" title={selectedFile.name}>
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.name.split('.').pop()?.toUpperCase()} File
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setExtractedText('');
                      }}
                      className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex-shrink-0"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {isParsing ? (
                    <div className="space-y-1.5 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />
                        <span>Reading file content...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-md w-fit mx-auto border border-emerald-100 dark:border-emerald-900/20 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Ready for AI analysis
                    </div>
                  )}
                </div>
              ) : (
                <label
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto ${
                    dragActive
                      ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10'
                      : 'border-slate-300 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/10 hover:bg-slate-50/80 dark:hover:bg-slate-900/20 hover:border-slate-400 dark:hover:border-slate-700'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                    <UploadCloud className="h-8 w-8 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Drag & drop your resume file here
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      or click to browse files from your device
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800/80 px-2 py-0.5 rounded bg-white dark:bg-slate-950">
                    Supports PDF, DOCX, TXT (Max 5MB)
                  </div>
                </label>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleAnalyze(extractedText)}
                  disabled={!extractedText.trim() || isParsing}
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 font-medium text-xs px-4 py-2.5 rounded-lg transition-colors text-white shadow-sm animate-fade-in"
                >
                  <Sparkles className="h-4 w-4" />
                  Analyze Uploaded Resume
                </button>
              </div>
            </div>
          ) : (
            /* Plain Text Mode */
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Resume Content</label>
                <button
                  onClick={() => setResumeText(SAMPLE_RESUME)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  Fill Sample Resume
                </button>
              </div>

              <textarea
                placeholder="Paste your resume text content here..."
                rows={12}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-mono"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => handleAnalyze(resumeText)}
                  disabled={!resumeText.trim()}
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 font-medium text-xs px-4 py-2.5 rounded-lg transition-colors text-white shadow-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  Analyze Resume Text
                </button>
              </div>
            </div>
          )}

          {/* Toggle mode link */}
          <div className="flex justify-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setUseTextMode(!useTextMode);
                setSelectedFile(null);
                setResumeText('');
                setExtractedText('');
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline underline-offset-4"
            >
              {useTextMode ? "Or upload a resume file instead" : "Or paste plain resume text instead"}
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-6 shadow-sm min-h-[300px] flex flex-col justify-center items-center">
          <div className="relative flex justify-center items-center">
            {/* Spinning ring */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400" />
            <Sparkles className="h-6 w-6 text-indigo-500 absolute animate-pulse" />
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">Evaluating Resume</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 animate-pulse">{loadingSteps[loadingStep]}</p>
          </div>

          {/* Loader bar */}
          <div className="w-64 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-300"
              style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Analysis Report Results */}
      {result && (
        <div className="space-y-6">
          {/* Back button */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setResult(null)}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Analyze Another Resume
            </button>
            <span className="text-xs text-slate-400">Report generated by StudentProof AI</span>
          </div>

          {/* Metric cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm text-center space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Overall Resume Score</span>
              <h3 className="text-5xl font-display font-black text-indigo-600 dark:text-indigo-400">{result.score}/100</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Meets mid-tier graduate criteria</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm text-center space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">ATS Compatibility Score</span>
              <h3 className="text-5xl font-display font-black text-emerald-600 dark:text-emerald-400">{result.atsScore}/100</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Structure parsed correctly</p>
            </div>
          </div>

          {/* Detailed Lists: Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Strengths Detected
              </h4>
              <ul className="space-y-3">
                {result.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                    {str}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Critical Weaknesses
              </h4>
              <ul className="space-y-3">
                {result.weaknesses.map((weak, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                    {weak}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bullet points comparison */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
              Better Bullet Point Recommendations
            </h4>
            <div className="space-y-4">
              {result.bulletPoints.map((bp, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-900">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Original Draft</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-mono italic">"{bp.original}"</p>
                  </div>
                  <div className="space-y-1 md:border-l md:border-slate-200 dark:md:border-slate-800 md:pl-4">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Improved Bullet
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">"{bp.improved}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Keywords & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Keywords */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-3 md:col-span-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Recommended Missing Keywords</h4>
              <p className="text-xs text-slate-500">Incorporate these terms based on modern tech role profiles:</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {result.keywords.map((kw) => (
                  <span key={kw} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full border border-indigo-100 dark:border-indigo-900/40">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Next Steps</h4>
              <ul className="space-y-2">
                {result.suggestions.map((sug, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <ArrowRight className="h-3.5 w-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
