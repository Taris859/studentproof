import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileSearch,
  ShieldCheck,
  FilePlus,
  Mic,
  Presentation,
  Map,
  Kanban,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Fingerprint,
  Sparkles,
  Award
} from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const features = [
    {
      title: 'Resume Analyzer',
      desc: 'Verify ATS score, keyword matching, and receive suggestions for better bullet points.',
      icon: FileSearch,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40',
      href: '/resume-analyzer'
    },
    {
      title: 'Internship Checker',
      desc: 'Verify details of potential opportunities to spot scams and protect your data.',
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
      href: '/internship-checker'
    },
    {
      title: 'Application Generator',
      desc: 'Instantly write personalized cover letters, LinkedIn outreach, and cold emails.',
      icon: FilePlus,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40',
      href: '/application-generator'
    },
    {
      title: 'Interview Coach',
      desc: 'Analyze answers, score clarity, and practice mock rounds with interactive questions.',
      icon: Mic,
      color: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40',
      href: '/interview-coach'
    },
    {
      title: 'Presentation Analyzer',
      desc: 'Structure slide check, feedback on delivery prep, and sample audience Q&A notes.',
      icon: Presentation,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
      href: '/presentation-analyzer'
    },
    {
      title: 'Assignment Explainer',
      desc: 'Break down complex assignments into clear slide-points, viva questions, and summaries.',
      icon: BookOpen,
      color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40',
      href: '/assignment-explainer'
    },
    {
      title: 'Career Roadmap',
      desc: 'Step-by-step career path guidelines for engineers, product managers, designers, and more.',
      icon: Map,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
      href: '/career-roadmap'
    },
    {
      title: 'Application Tracker',
      desc: 'Visual Kanban board to organize, edit, and keep track of your job search progress.',
      icon: Kanban,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40',
      href: '/application-tracker'
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 text-center px-4 max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          The ultimate career companion for students
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-display font-black tracking-tight text-slate-900 dark:text-white"
        >
          Your AI Career Copilot. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500">
            From Application to Offer Letter.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Everything you need to land internships, jobs, and opportunities — in one place. Improve resumes, prep for interviews, and track applications with smart guidance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
        >
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Explore Features
          </a>
        </motion.div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
            Built for Academic and Career Success
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Interactive, AI-powered tools designed specifically for the next generation of professionals.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={itemVariants}
                className="group flex flex-col justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-md transition-all duration-300 hover:border-indigo-500/20"
              >
                <div className="space-y-4">
                  <div className={`inline-flex p-3 rounded-lg ${feat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    to={feat.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-1.5 transition-all"
                  >
                    Open Tool
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Simplicity at every step of your application cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Upload/Paste',
                desc: 'Paste your resume draft, internship post, presentation, or assignment text.'
              },
              {
                step: '02',
                title: 'Analyze',
                desc: 'Our AI models evaluate details against industry benchmarks and safety lists.'
              },
              {
                step: '03',
                title: 'Improve',
                desc: 'Receive instant suggestions, risk metrics, cold emails, or structured summaries.'
              },
              {
                step: '04',
                title: 'Apply Confidently',
                desc: 'Log interactions, prepare for interviews, and present your work with certainty.'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
                <div className="font-display font-black text-4xl text-indigo-600/10 dark:text-indigo-400/10 absolute top-4 right-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white pt-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-indigo-500/10 dark:border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/10 rounded-2xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex p-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
              Designed for Student Protection and Education
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              We stand against misleading placements and fake reviews. StudentProof is a pure AI-powered learning and safety assistant to help you think critically about career decisions.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 p-1.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md h-9 w-9 flex items-center justify-center">
                <Fingerprint className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-950 dark:text-white text-sm">Privacy & Security First</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  We process data directly using secure algorithms and store your entries locally in your browser. We never sell your personal information.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 p-1.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md h-9 w-9 flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-950 dark:text-white text-sm">Educational Guidance Only</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Our suggestions provide structured analysis and improvement suggestions, giving you critical research skills rather than unverified shortcuts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
