import { Eye, Shield, Users, BookOpen, GraduationCap } from 'lucide-react';

export default function About() {
  const values = [
    {
      name: 'Transparency',
      description: 'We do not claim certainty or guaranteed outcomes. All AI-powered checker reports detail probability indicators and safety flags to guide student decisions.',
      icon: Eye,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
    },
    {
      name: 'Trust & Safety',
      description: 'We stand against unverified job placement claims. We teach students to vet offers, inspect emails, and review agreements before committing.',
      icon: Shield,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
    },
    {
      name: 'Accessibility',
      description: 'Premium career guidance tools should not cost thousands. We keep our services highly accessible so every college student can build an excellent career path.',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40'
    },
    {
      name: 'Continuous Learning',
      description: 'Our tools provide structural logic rather than quick copy-pastes. We highlight why suggestions are made so you improve your written/viva capability.',
      icon: BookOpen,
      color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero / Mission */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
          <GraduationCap className="h-10 w-10" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-900 dark:text-white">
          Our Mission: Empowering Student Careers
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
          StudentProof was founded to bridge the gap between academic education and modern recruiting. We build career copilots that help students identify genuine opportunities, perfect their applications, and build structural readiness.
        </p>
      </div>

      {/* Grid Values */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.name}
                className="flex gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-sm transition-all"
              >
                <div className={`p-3 rounded-lg h-12 w-12 flex items-center justify-center flex-shrink-0 ${val.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{val.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{val.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance / Safe Statement Banner */}
      <div className="border border-amber-500/10 dark:border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/10 rounded-xl p-6 sm:p-8 space-y-4 text-center">
        <h3 className="font-display font-bold text-lg text-amber-800 dark:text-amber-400">Important Educational Notice</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
          "StudentProof provides educational guidance and AI-powered recommendations. Students should always perform their own due diligence before accepting opportunities."
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Our algorithms screen resumes and jobs against common ATS structures and risk signals. However, AI reports are heuristic in nature and are not legal or contract guarantees.
        </p>
      </div>

      {/* Privacy Guarantee */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 space-y-6">
        <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">How We Handle Your Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-500 dark:text-slate-400">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Local Cache Storage</h4>
            <p className="text-xs">
              All applications in your Tracker are stored entirely in your local browser cache (LocalStorage). No tracking cookies are injected.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">No Placement Fees</h4>
            <p className="text-xs">
              Unlike platforms that take commissions from your salary, we operate on a simple subscription fee. You keep 100% of your earnings.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Security Encrypted</h4>
            <p className="text-xs">
              Any file or text uploads remain isolated during the processing session and are not permanently compiled for marketing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
