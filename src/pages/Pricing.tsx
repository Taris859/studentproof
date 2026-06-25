import { useState } from 'react';
import { Check, ArrowRight, ShieldCheck, X, Loader2, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Pricing() {
  const navigate = useNavigate();
  const [customAmount, setCustomAmount] = useState(30);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'verifying' | 'success'>('idle');
  const [payerName, setPayerName] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenCheckout = (name: string, price: string) => {
    setSelectedPlan({ name, price });
    setIsModalOpen(true);
    setCheckoutStep('idle');
    setPayerName('');
    setTransactionId('');
    setErrorMessage('');
  };

  const handleConfirmPayment = () => {
    if (!payerName.trim()) {
      setErrorMessage('Please enter the name on your payment account.');
      return;
    }
    if (!transactionId.trim()) {
      setErrorMessage('Please enter the UPI Reference No. / Transaction ID.');
      return;
    }

    setCheckoutStep('verifying');

    // Simulate verification
    setTimeout(() => {
      const cached = localStorage.getItem('studentproof_profile');
      let profileObj: any = {
        name: payerName.trim(),
        email: 'alex.carter@student.in',
        phone: '+91 98765 43210',
        college: 'Indian Institute of Technology, Bombay',
        gradYear: '2027',
        interest: 'software',
        skills: 'React, Node.js, JavaScript, Python, Git',
        bio: 'Computer Science sophomore focused on web development and open-source contributions.',
        isPremium: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150'
      };

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          profileObj = {
            ...parsed,
            isPremium: true
          };
          if (payerName.trim()) {
            profileObj.name = payerName.trim();
          }
        } catch {
          // Keep default initialized profile
        }
      }

      localStorage.setItem('studentproof_is_premium', 'true');
      localStorage.setItem('studentproof_profile', JSON.stringify(profileObj));
      window.dispatchEvent(new Event('storage'));
      setCheckoutStep('success');

      // Auto-redirect to dashboard after 2.5s
      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/dashboard');
      }, 2500);
    }, 2000);
  };

  const tiers = [
    {
      name: 'Free Plan',
      price: '₹0',
      description: 'Ideal for getting started with resume improvements and basic interview reviews.',
      features: [
        '5 Resume Analyses / month',
        '3 Internship Safety Checks',
        '3 Interview Answer Reviews',
        'Basic Cover Letter Outline',
        'Local browser storage dashboard'
      ],
      cta: 'Get Started Free',
      popular: false,
      href: '/dashboard',
      isExternal: false
    },
    {
      name: 'Premium Student',
      price: '₹99',
      description: 'Unlock complete tools to accelerate your internship applications.',
      features: [
        'Unlimited Resume & Job Scans',
        'Priority AI Lane (5x Faster Processing)',
        'Custom Cold Email & LinkedIn Pitch Generators',
        'Interactive Career Roadmaps & Syllabus Guides',
        'Presentation Slide Deck Audit',
        'Unlimited AI Assignment Explainer runs',
        'Full Kanban Application Tracker'
      ],
      cta: 'Upgrade to Premium',
      popular: true,
      href: 'https://razorpay.me/@chatrixbytanuja',
      isExternal: true
    },
    {
      name: 'Pro Career Prep',
      price: '₹199',
      description: 'Built for active job seekers looking for advanced portfolio mapping.',
      features: [
        'Everything in Premium Student',
        'Exportable ATS PDF Reports',
        'Interactive Viva Coach with Follow-up Loops',
        'Advanced Semantic Keyword Matching maps',
        'Portfolio Readiness evaluation & reviews',
        'Priority Technical Support line'
      ],
      cta: 'Go Pro',
      popular: false,
      href: 'https://razorpay.me/@chatrixbytanuja',
      isExternal: true
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

              <div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-display font-black text-slate-900 dark:text-white">{tier.price}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">/ month</span>
                </div>
                {tier.isExternal && (
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-md w-fit border border-emerald-100 dark:border-emerald-900/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Instant Activation via Razorpay (UPI & Cards)</span>
                  </div>
                )}
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
              {tier.isExternal ? (
                <button
                  onClick={() => handleOpenCheckout(tier.name, tier.price)}
                  className={`w-full inline-flex justify-center items-center gap-1.5 font-medium px-4 py-2.5 rounded-lg transition-colors text-sm ${
                    tier.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-transparent'
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
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
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pay What You Want Section */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-50/50 to-indigo-100/30 dark:from-slate-900/50 dark:to-slate-900/20 border border-indigo-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Student Solidarity Plan
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Pay What You Can / Want</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              On a tight student budget? We believe career tools should be accessible to all. Choose any amount from <strong>₹10 to ₹50</strong> to unlock Premium features with standard monthly limits.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex flex-col items-center gap-4 w-full md:w-64 shadow-inner">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Your Contribution</span>
              <div className="text-3xl font-display font-black text-indigo-600 dark:text-indigo-400 mt-1">
                ₹{customAmount}
              </div>
            </div>
            
            <input
              type="range"
              min="10"
              max="50"
              value={customAmount}
              onChange={(e) => setCustomAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
            />
            
            <button
              onClick={() => handleOpenCheckout('Student Solidarity Plan', `₹${customAmount}`)}
              className="w-full inline-flex justify-center items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Pay ₹{customAmount} via Razorpay
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
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
              Secure payments powered by Razorpay. All Indian payment methods supported (UPI, Netbanking, Cards, Wallets).
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs sm:text-right">
          Activate premium features instantly after a secure checkout.
        </p>
      </div>

      {/* Checkout Modal */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative transition-all duration-300">
            {checkoutStep === 'idle' && (
              <>
                {/* Header */}
                <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
                      <Sparkles className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-slate-900 dark:text-white">Activate Premium</h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Step-by-step payment verification</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  {/* Selected Plan Details */}
                  <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/20 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Selected Plan</span>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{selectedPlan.name}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Price</span>
                      <p className="text-xl font-display font-black text-slate-900 dark:text-white">{selectedPlan.price}</p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div className="space-y-2 flex-1">
                        <h5 className="text-xs font-bold text-slate-800 dark:text-white">Open Razorpay & Complete Payment</h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Pay securely using any UPI app, Card, or Wallet on the Razorpay link.
                        </p>
                        <button
                          onClick={() => window.open('https://razorpay.me/@chatrixbytanuja', '_blank')}
                          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm mt-1"
                        >
                          Pay {selectedPlan.price} via Razorpay
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div className="space-y-3 flex-1">
                        <h5 className="text-xs font-bold text-slate-800 dark:text-white">Confirm Payment Details</h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Enter your details below so we can verify the transaction record and activate your account.
                        </p>
                        
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Your Name (used for payment)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Alex Carter"
                            value={payerName}
                            onChange={(e) => setPayerName(e.target.value)}
                            className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            UPI Reference No. / Transaction ID
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. UPI Ref: 619284729182"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        {errorMessage && (
                          <p className="text-rose-500 dark:text-rose-400 text-xs font-semibold">{errorMessage}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-lg transition-colors shadow-md flex items-center gap-1.5"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    I Have Completed My Payment
                  </button>
                </div>
              </>
            )}

            {checkoutStep === 'verifying' && (
              <div className="p-8 text-center space-y-6 flex flex-col items-center justify-center min-h-[350px]">
                <Loader2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-950 dark:text-white text-base">Verifying Payment Status</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed animate-pulse">
                    Connecting to Razorpay ledger APIs and matching your transaction reference ID...
                  </p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-left text-slate-500 dark:text-slate-400 space-y-1">
                  <div>&gt; GET https://api.razorpay.com/v1/payments/verify...</div>
                  <div>&gt; Name match: {payerName}</div>
                  <div>&gt; TXN ID search: {transactionId}</div>
                  <div className="text-emerald-500 font-semibold">&gt; Transaction verified successfully! Status: Active</div>
                </div>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="p-8 text-center space-y-6 flex flex-col items-center justify-center min-h-[350px]">
                <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-display font-black text-slate-950 dark:text-white text-2xl">Premium Activated!</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Thank you for upgrading! Your account has been upgraded to **Premium**. All features are now unlocked.
                  </p>
                </div>

                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3 animate-spin" />
                  Redirecting to dashboard...
                </div>

                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Go to Dashboard Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
