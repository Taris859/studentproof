import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="h-7 w-7" />
              <span className="font-display font-bold text-xl tracking-tight">StudentProof</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
              Your AI career copilot, helping you refine your resume, verify internships, practice interviews, and land your dream offer.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-slate-500 dark:text-slate-400">
                Email: support@studentproof.ai
              </li>
              <li className="text-sm text-slate-500 dark:text-slate-400">
                Office: Tech Hub, Bangalore, India
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer and Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed text-center md:text-left">
            Disclaimer: StudentProof provides educational guidance and AI-powered recommendations. Students should always perform their own due diligence before accepting opportunities.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
            <span>&copy; {new Date().getFullYear()} StudentProof. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
