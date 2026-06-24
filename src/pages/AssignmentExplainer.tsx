import { useState } from 'react';
import { BookOpen, Sparkles, UploadCloud, FileText, CheckCircle, ArrowLeft } from 'lucide-react';
import { explainAssignment } from '../lib/aiMock';
import type { AssignmentExplanation } from '../lib/aiMock';

const SAMPLE_ASSIGNMENT = `Subject: Database Management Systems (CS-302)
Assignment 3: Database Normalization & Key Optimization

Scenario:
A university database schema stores records for student course signups. The single table includes:
StudentId, StudentName, CourseId, CourseName, InstructorId, InstructorName, RoomNumber, EnrollmentDate, Grade.

Tasks:
1. Identify database redundancies and update anomalies.
2. Explain the functional dependencies.
3. Normalize the schema from 1NF to 3NF (Third Normal Form) and draw the resulting schemas.`;

export default function AssignmentExplainer() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<AssignmentExplanation | null>(null);

  const handleSelectSample = () => {
    setInputText(SAMPLE_ASSIGNMENT);
    setFileName('database_normalization_assignment.pdf');
  };

  const handleFileUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setInputText(`File Mock: [${file.name}]\nAssignment contents parsed. Prepared to explain normalization tasks and syllabus details.`);
    }
  };

  const handleExplain = async () => {
    if (!inputText.trim()) return;
    setLoading(true);

    try {
      const data = await explainAssignment(inputText);
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
          <BookOpen className="h-5 w-5 text-indigo-500" />
          AI Assignment Explainer
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload assignment questions or PDF briefs. Get an interactive summary, slide talking points, and typical oral exam (viva) questions.
        </p>
      </div>

      {!result && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* File upload sidebar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4 text-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upload Homework PDF</h3>
            
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all cursor-pointer relative flex flex-col justify-center items-center h-48">
              <UploadCloud className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Drop homework files</span>
              <span className="text-[10px] text-slate-400 mt-1">Files are uploaded for UI preview</span>
              <span className="text-[9px] text-amber-500 font-medium mt-1">Note: Paste homework text on the right for MVP analysis. PDF parsing will be added in backend.</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
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
              Or load sample CS normal form prompt
            </button>
          </div>

          {/* Text Input area */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Assignment Questions Text</h3>
            
            <textarea
              placeholder="Paste homework tasks, questions, or assignment details here..."
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-mono"
            />

            <div className="flex justify-end">
              <button
                onClick={handleExplain}
                disabled={!inputText.trim()}
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 font-medium text-xs px-4 py-2.5 rounded-lg transition-colors text-white shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                Explain Assignment Concepts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-4 shadow-sm min-h-[300px] flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400" />
          <h4 className="font-bold text-slate-800 dark:text-white text-sm">Decoding Assignment Syllabus...</h4>
          <p className="text-xs text-slate-400">Summarizing scenario, generating slide points, and preparing exam viva briefs...</p>
        </div>
      )}

      {/* Results output */}
      {result && (
        <div className="space-y-6">
          {/* Header Action */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setResult(null);
                setFileName(null);
                setInputText('');
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Explain Another Assignment
            </button>
            <span className="text-xs text-slate-400 font-display font-semibold">Parsed successfully</span>
          </div>

          {/* Conceptual Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2">Conceptual Summary</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {result.summary}
            </p>
          </div>

          {/* Presentation talking points & Syllabus Topics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Slide Presentation Bullet Outline</h4>
              <ul className="space-y-3.5">
                {result.presentationPoints.map((pt, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                    <span className="text-indigo-500 font-bold font-display">{idx + 1}.</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Important Course Topics to Study</h4>
              <ul className="space-y-3.5">
                {result.importantTopics.map((top, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span>{top}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Oral Exam Viva Questions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Common Oral Exam (Viva) Questions</h4>
            <div className="space-y-4">
              {result.vivaQuestions.map((qa, idx) => (
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
