import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Calendar,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  FileCheck
} from 'lucide-react';

interface Application {
  id: string;
  company: string;
  role: string;
  deadline: string;
  notes: string;
  status: 'Interested' | 'Applied' | 'Interview' | 'Shortlisted' | 'Rejected' | 'Selected';
}

const DEFAULT_APPLICATIONS: Application[] = [
  { id: '1', company: 'Google', role: 'Software Engineering Intern', deadline: '2026-07-15', notes: 'Need to prepare for DSA round.', status: 'Interview' },
  { id: '2', company: 'Stripe', role: 'Frontend Developer Intern', deadline: '2026-07-20', notes: 'Submitted resume. Followed up on LinkedIn.', status: 'Applied' },
  { id: '3', company: 'Linear', role: 'Product Design Intern', deadline: '2026-08-01', notes: 'Portfolio under review.', status: 'Interested' },
  { id: '4', company: 'Vercel', role: 'Developer Relations Intern', deadline: '2026-06-30', notes: 'Got short-listed for video intro.', status: 'Shortlisted' }
];

export default function Dashboard() {
  const [apps, setApps] = useState<Application[]>([]);
  const resumeScore = 82; // Mock resume score

  useEffect(() => {
    const cached = localStorage.getItem('studentproof_applications');
    if (cached) {
      try {
        setApps(JSON.parse(cached));
      } catch (e) {
        setApps(DEFAULT_APPLICATIONS);
      }
    } else {
      localStorage.setItem('studentproof_applications', JSON.stringify(DEFAULT_APPLICATIONS));
      setApps(DEFAULT_APPLICATIONS);
    }
  }, []);

  const totalApps = apps.length;
  const appliedCount = apps.filter(a => a.status === 'Applied').length;
  const interviewCount = apps.filter(a => a.status === 'Interview').length;
  const shortlistedCount = apps.filter(a => a.status === 'Shortlisted').length;
  const selectedCount = apps.filter(a => a.status === 'Selected').length;

  // Active items for interviews
  const upcomingInterviews = apps.filter(a => a.status === 'Interview');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 dark:from-slate-900 dark:to-indigo-950 border border-indigo-500/10 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-950/20">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden sm:block">
          <Sparkles className="w-full h-full text-indigo-400" />
        </div>
        <div className="relative space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            AI Copilot Active
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold">Welcome back, Alex!</h2>
          <p className="text-sm text-indigo-200 leading-relaxed">
            Your career copilot is monitoring 4 active internship stages. You have an upcoming interview loop with Google. Keep improving your resume structure to boost your ATS compatibility.
          </p>
          <div className="pt-2">
            <Link
              to="/resume-analyzer"
              className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-indigo-900 font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              Analyze Resume
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Resume Score',
            value: `${resumeScore}/100`,
            change: 'Top 15% of candidates',
            color: 'text-indigo-600 dark:text-indigo-400',
            desc: 'ATS friendly structure'
          },
          {
            title: 'Applications Traced',
            value: totalApps,
            change: `${appliedCount} pending response`,
            color: 'text-blue-600 dark:text-blue-400',
            desc: 'Synced with tracker board'
          },
          {
            title: 'Interview Stages',
            value: interviewCount,
            change: '1 scheduled this week',
            color: 'text-amber-600 dark:text-amber-400',
            desc: 'Prep coach active'
          },
          {
            title: 'Offers & Shortlists',
            value: shortlistedCount + selectedCount,
            change: selectedCount > 0 ? 'Offer letter received' : 'Final review stage',
            color: 'text-emerald-600 dark:text-emerald-400',
            desc: 'Shortlisted profiles'
          }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2 shadow-sm transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{stat.title}</p>
            <h3 className={`text-2xl sm:text-3xl font-display font-black ${stat.color}`}>{stat.value}</h3>
            <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400 truncate">{stat.desc}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 ml-1">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Details and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Profile completeness & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Completeness & Copilot Suggestions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              Copilot Career Suggestions
            </h3>

            <div className="flex flex-col sm:flex-row gap-6 items-center bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-xl p-5">
              {/* Radial Progress */}
              <div className="relative h-24 w-24 flex-shrink-0 flex items-center justify-center">
                <svg className="absolute w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="6" fill="transparent" />
                  <circle cx="48" cy="48" r="40" className="stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - 0.8)} strokeLinecap="round" />
                </svg>
                <div className="text-center">
                  <span className="text-xl font-black text-slate-900 dark:text-white">80%</span>
                  <p className="text-[9px] text-slate-500 uppercase font-semibold">Complete</p>
                </div>
              </div>
              
              <div className="space-y-2 text-center sm:text-left">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Finish your Application Profile</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You are almost ready to start batching cold emails. Add 1 more project description and verify your LinkedIn outreach template to hit 100%.
                </p>
              </div>
            </div>

            {/* Checklist of actions */}
            <div className="space-y-3">
              {[
                { title: 'Optimize resume bullet points', desc: 'Convert "worked on site" to impact metrics.', path: '/resume-analyzer', status: 'pending' },
                { title: 'Practice for upcoming Google Interview', desc: 'Run through mock questions in Interview Coach.', path: '/interview-coach', status: 'pending' },
                { title: 'Verify safety details of Linear application', desc: 'No risk indicators detected yet.', path: '/internship-checker', status: 'completed' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40 rounded-lg">
                  {item.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-indigo-500/20" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.desc}</p>
                  </div>
                  <Link
                    to={item.path}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    Go
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Upcoming Interviews & Quick Links */}
        <div className="space-y-6">
          {/* Upcoming Interviews Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              Upcoming Interviews
            </h3>

            {upcomingInterviews.length > 0 ? (
              <div className="space-y-3">
                {upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/10 rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{interview.company}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{interview.role}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 text-[10px] font-bold rounded-full">
                        Prep Needed
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-t border-indigo-500/5 pt-2">
                      <span>Deadline: {interview.deadline}</span>
                      <Link to="/interview-coach" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                        Launch Coach
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                <Calendar className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No interviews scheduled yet</p>
                <Link to="/application-tracker" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-1 inline-block">
                  Go to Kanban board
                </Link>
              </div>
            )}
          </div>

          {/* Quick Stats / Achievements */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-500" />
              Achievements
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Resume Optimized</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">ATS compatible score achieved</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">First Application Tracked</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Synced to workspace database</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
