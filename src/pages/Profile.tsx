import { useState, useEffect } from 'react';
import { User, Phone, BookOpen, Sparkles, CheckCircle, Save, ToggleLeft, ToggleRight, X } from 'lucide-react';

export interface StudentProfileData {
  name: string;
  email: string;
  phone: string;
  college: string;
  gradYear: string;
  interest: string;
  skills: string;
  bio: string;
  isPremium: boolean;
  avatar: string;
}

const DEFAULT_PROFILE: StudentProfileData = {
  name: '',
  email: '',
  phone: '',
  college: '',
  gradYear: '',
  interest: 'software',
  skills: '',
  bio: '',
  isPremium: false,
  avatar: ''
};

const AVATARS = [
  { name: 'Default Female Student', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150' },
  { name: 'Male Student', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150' },
  { name: 'Tech Professional', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150' },
  { name: 'Creative Designer', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150' }
];

const INTEREST_MAP: Record<string, string> = {
  software: 'Software Engineer',
  fullstack: 'Full-Stack Developer (MERN/Java)',
  aiml: 'AI & Machine Learning Engineer',
  devops: 'DevOps & Cloud Engineer',
  mobile: 'Mobile App Developer (Flutter/Android)',
  ba: 'Business Analyst',
  vlsi: 'VLSI & Embedded Systems Engineer',
  finance: 'Chartered Accountant & Finance Analyst',
  civilservices: 'Civil Services (UPSC IAS Track)',
  consulting: 'Management Consultant',
  cyber: 'Cybersecurity Analyst',
  data: 'Data Analyst',
  uiux: 'UI/UX Designer',
  pm: 'Product Manager',
  marketing: 'Digital Marketer',
  writing: 'Content Writer'
};

export default function Profile() {
  const [profile, setProfile] = useState<StudentProfileData>(DEFAULT_PROFILE);
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem('studentproof_profile');
    const isPremiumPurchased = localStorage.getItem('studentproof_is_premium') === 'true';
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setProfile({
          ...parsed,
          isPremium: isPremiumPurchased || !!parsed.isPremium
        });
      } catch {
        setProfile({
          ...DEFAULT_PROFILE,
          isPremium: isPremiumPurchased
        });
      }
    } else {
      const initial = {
        ...DEFAULT_PROFILE,
        isPremium: isPremiumPurchased
      };
      localStorage.setItem('studentproof_profile', JSON.stringify(initial));
      setProfile(initial);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const isPremiumPurchased = localStorage.getItem('studentproof_is_premium') === 'true';
    const updated = {
      ...profile,
      isPremium: isPremiumPurchased || profile.isPremium
    };
    setProfile(updated);
    localStorage.setItem('studentproof_profile', JSON.stringify(updated));
    
    // Broadcast storage event to update sidebar state immediately
    window.dispatchEvent(new Event('storage'));
    
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const togglePremium = () => {
    const updatedStatus = !profile.isPremium;
    const updated = { ...profile, isPremium: updatedStatus };
    setProfile(updated);
    localStorage.setItem('studentproof_profile', JSON.stringify(updated));
    localStorage.setItem('studentproof_is_premium', updatedStatus ? 'true' : 'false');
    window.dispatchEvent(new Event('storage'));
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updated = { ...profile, avatar: base64String };
        setProfile(updated);
        localStorage.setItem('studentproof_profile', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="h-5 w-5 text-indigo-500" />
          Student Profile
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Provide your information and interests. Our AI Copilot reads this profile to customize resumes, roadmaps, and mock interviews without confusion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Avatar Card & Premium Toggle */}
        <div className="space-y-6">
          {/* Avatar card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              {profile.avatar ? (
                <img
                  className="w-full h-full rounded-full border-2 border-indigo-500/20 shadow-md object-cover"
                  src={profile.avatar}
                  alt="Avatar"
                />
              ) : (
                <div className="w-full h-full rounded-full border-2 border-indigo-500/20 shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl uppercase">
                  {profile.name ? (
                    profile.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                  ) : (
                    <User className="h-10 w-10 text-white/90" />
                  )}
                </div>
              )}
              <span className={`absolute bottom-1 right-1 block h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 ${profile.isPremium ? 'bg-indigo-500' : 'bg-slate-400'}`} />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {profile.name || "Set Your Name"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {profile.college || "No college/university specified"}
              </p>
            </div>

            {/* Avatar Presets Selection Grid */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Choose Avatar Preset</span>
              <div className="flex justify-center gap-2">
                {AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const updated = { ...profile, avatar: av.url };
                      setProfile(updated);
                      localStorage.setItem('studentproof_profile', JSON.stringify(updated));
                      window.dispatchEvent(new Event('storage'));
                    }}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                      profile.avatar === av.url ? 'border-indigo-600 scale-110 shadow-sm' : 'border-transparent hover:border-slate-300'
                    }`}
                    title={av.name}
                  >
                    <img className="w-full h-full object-cover" src={av.url} alt={av.name} />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Avatar Upload */}
            <div className="space-y-1.5 pt-2.5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Or Upload Custom Photo</span>
              <div className="flex items-center justify-center gap-2">
                <label className="cursor-pointer inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full">
                  <span>Choose Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                </label>
                {profile.avatar && !AVATARS.some(av => av.url === profile.avatar) && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...profile, avatar: '' };
                      setProfile(updated);
                      localStorage.setItem('studentproof_profile', JSON.stringify(updated));
                      window.dispatchEvent(new Event('storage'));
                    }}
                    className="p-1.5 border border-rose-200 dark:border-rose-950 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors flex-shrink-0"
                    title="Remove custom image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-center">
              {profile.isPremium ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  Premium Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-transparent">
                  Basic Free User
                </span>
              )}
            </div>
          </div>

          {/* Premium Simulation Switch */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Simulate Premium Status</h4>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">Toggle to test the Premium features experience.</p>
              </div>
              <button onClick={togglePremium} className="text-indigo-600 dark:text-indigo-400 focus:outline-none">
                {profile.isPremium ? (
                  <ToggleRight className="h-9 w-9" />
                ) : (
                  <ToggleLeft className="h-9 w-9 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Profile Info Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-5 text-xs sm:text-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-indigo-500" /> Profile Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Carter"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex.carter@student.in"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Career Goal */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Target Career Goal</label>
                <select
                  value={profile.interest}
                  onChange={(e) => setProfile({ ...profile, interest: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {Object.entries(INTEREST_MAP).map(([key, name]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* College */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">College / University Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indian Institute of Technology, Bombay"
                  value={profile.college}
                  onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Graduation Year */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Graduation Year</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2027"
                  value={profile.gradYear}
                  onChange={(e) => setProfile({ ...profile, gradYear: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Skills */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Core Technical/Core Skills (Comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React, Node.js, JavaScript, Python, Git"
                  value={profile.skills}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Bio / Experience */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Brief Bio / Interests</label>
              <textarea
                rows={3}
                placeholder="Write a brief introduction about your career goals, background, or learning interests..."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Save Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                {savedStatus && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs animate-fade-in">
                    <CheckCircle className="h-4 w-4" />
                    Profile Updated Successfully!
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4.5 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <Save className="h-4 w-4" />
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
