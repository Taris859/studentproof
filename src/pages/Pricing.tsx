import { Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const tiers = [
    {
      name: 'Free Plan',
      price: '₹0',
      description: 'Ideal for getting started with resume improvements and basic interview reviews.',
      features: [
        '5 Resume Analyses',
        '3 Internship Safety Checks',
        '3 Interview Answer Reviews',
        'Basic Cover Letter Generator',
        'Local browser storage dashboard'
      ],
      cta: 'Get Started Free',
      popular: false,
      href: '/dashboard'
    },
    {
      name: 'Premium Student',
      price: '₹99',
      description: 'Unlock complete tools to accelerate your internship applications.',
      features: [
        'Unlimited Resume Analyses',
        'Unlimited Internship Checks',
        'Unlimited Interview Reviews',
        'Full Kanban Application Tracker',
        'Interactive Career Roadmaps',
        'Presentation Deck Analysis',
        'AI Assignment Explainer',
        '24/7 AI response caching'
      ],
      cta: 'Upgrade to Premium',
      popular: true,
      href: '/dashboard'
    },
    {
      name: 'Pro Career Prep',
      price: '₹199',
      description: 'Built for active job seekers looking for advanced portfolio mapping.',
      features: [
        'Everything in Premium',
        'Priority AI Processing simulation',
        'Advanced ATS Optimization Reports',
        'Advanced Portfolio & Career Planning',
        'Mock Interview Follow-ups',
        'Exportable reports (PDF format)'
      ],
      cta: 'Go Pro',
      popular: false,
      href: '/dashboard'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-900 dark:text-white">
          Simple, Affordable Pricing
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Supercharge your career prep. Cancel anytime. No hidden charges or placement success commissions.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col justify-between p-8 bg-white dark:bg-slate-900 border rounded-2xl transition-all duration-300 relative ${
              tier.popular
                ? 'border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-600/5 ring-1 ring-indigo-600 dark:ring-indigo-500 scale-105 z-10'
                : 'border-slate-200 dark:border-slate-800 hover:shadow-lg'
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">{tier.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{tier.description}</p>
              </div>

              <div className="flex items-baseline">
                <span className="text-4xl font-display font-black text-slate-900 dark:text-white">{tier.price}</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">/ month</span>
              </div>

              <ul className="space-y-3.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Link
                to={tier.href}
                className={`w-full inline-flex justify-center items-center gap-1.5 font-medium px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  tier.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-transparent'
                }`}
              >
                {tier.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="max-w-4xl mx-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 rounded-xl p-6 flex flex-col sm:flex-row gap-4 items-center justify-between text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Safe & Transparent Guarantee</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              We never store your credit cards. Billing is managed via standard, secure local checkouts.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs sm:text-right">
          All mock plans are simulated for demonstration. Users can explore complete Pro features instantly.
        </p>
      </div>
    </div>
  );
}
