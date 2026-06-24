import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react';
import { checkInternship } from '../lib/aiMock';
import type { InternshipReport } from '../lib/aiMock';

export default function InternshipChecker() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [stipend, setStipend] = useState('');
  const [duration, setDuration] = useState('');
  const [locationType, setLocationType] = useState('Remote');
  const [paymentRequested, setPaymentRequested] = useState<'Yes' | 'No'>('No');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InternshipReport | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    setLoading(true);

    try {
      const data = await checkInternship({
        title,
        company,
        website,
        description,
        email,
        stipend,
        duration,
        locationType,
        paymentRequested
      });
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
          <ShieldCheck className="h-5 w-5 text-indigo-500" />
          AI Internship Checker & Vet
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Vet job details, stipends, and contact emails to detect fraud flags. We cross-reference listings against student safety guidelines.
        </p>
      </div>

      {/* Main Container */}
      {!result && !loading && (
        <form onSubmit={handleCheck} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">Internship Opportunity Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Internship Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Web Development Trainee"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Tech Solutions"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Company Website</label>
              <input
                type="text"
                placeholder="e.g. apextech.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Recruiter Email Address</label>
              <input
                type="email"
                placeholder="e.g. hr.apextech@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Stipend Details (e.g. ₹5,000/mo, Unpaid)</label>
              <input
                type="text"
                placeholder="e.g. ₹10,000/month"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Duration (Months)</label>
                <input
                  type="text"
                  placeholder="e.g. 3 Months"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Location</label>
                <select
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs sm:text-sm">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 font-display">Internship Description / Requirements</label>
            <textarea
              placeholder="Paste the description here..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Payment requested selector */}
          <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/10 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-xs font-bold text-amber-800 dark:text-amber-400 block">Payment Request Screen</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Did the company or job post ask for payment for course registration, software licenses, or verification fees?
              </p>
            </div>
            <div className="flex gap-2">
              {['Yes', 'No'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPaymentRequested(opt as 'Yes' | 'No')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    paymentRequested === opt
                      ? 'bg-amber-600 border-transparent text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt}
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
              Verify Opportunity safety
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-4 shadow-sm min-h-[300px] flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400" />
          <h4 className="font-bold text-slate-800 dark:text-white text-sm">Auditing Listing Signals...</h4>
          <p className="text-xs text-slate-400">Comparing email headers, stipend thresholds, and payment keywords...</p>
        </div>
      )}

      {/* Verification Report */}
      {result && (
        <div className="space-y-6">
          {/* Header Action */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setResult(null)}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Verify Another Post
            </button>
            <span className="text-xs text-slate-400">Verification Report ID: SP-{(Math.random() * 100000).toFixed(0)}</span>
          </div>

          {/* Risk Card */}
          <div className={`border rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
            result.riskLevel === 'High'
              ? 'bg-red-50/50 dark:bg-red-950/20 border-red-500/20'
              : result.riskLevel === 'Medium'
              ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-500/20'
              : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/20'
          }`}>
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400">Safety Risk Score</span>
              <div className="flex items-center gap-2">
                {result.riskLevel === 'High' ? (
                  <ShieldAlert className="h-6 w-6 text-red-500" />
                ) : (
                  <ShieldCheck className={`h-6 w-6 ${result.riskLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`} />
                )}
                <h3 className={`text-2xl font-display font-black ${
                  result.riskLevel === 'High' ? 'text-red-600 dark:text-red-400' : result.riskLevel === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {result.riskLevel} Risk Profile Detected
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                Analysis output: Potential risk indicators detected. We perform heuristics matches against email addresses, stipends, and payment requests.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Opportunity</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{company}</p>
            </div>
          </div>

          {/* Positives vs Risks Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Positive Signals
              </h4>
              {result.positives.length > 0 ? (
                <ul className="space-y-2">
                  {result.positives.map((pos, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{pos}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No strong positive signals detected in the form variables.</p>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" /> Safety Risks / Warnings
              </h4>
              {result.risks.length > 0 ? (
                <ul className="space-y-2">
                  {result.risks.map((risk, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="text-red-500 font-bold">⚠</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                  ✓ No severe risk signals matching scam profiles detected.
                </p>
              )}
            </div>
          </div>

          {/* Action and verification items */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Recommended Next Steps</h4>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <span className="font-bold block text-slate-900 dark:text-white mb-1">Recommended Action:</span>
              {result.action}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <h5 className="font-bold text-xs text-slate-700 dark:text-slate-200 uppercase">Verification To Perform:</h5>
                <ul className="space-y-2">
                  {result.verifications.map((ver, idx) => (
                    <li key={idx} className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex gap-2">
                      <span className="text-indigo-500 font-bold">{idx + 1}.</span>
                      <span>{ver}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-xs text-slate-700 dark:text-slate-200 uppercase">Questions To Ask recruiter:</h5>
                <ul className="space-y-2">
                  {result.questions.map((q, idx) => (
                    <li key={idx} className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic flex gap-2">
                      <span className="text-indigo-500 font-bold">"</span>
                      <span>{q}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
