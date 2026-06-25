import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSearch,
  ShieldCheck,
  FilePlus,
  Mic,
  Presentation,
  BookOpen,
  Map,
  Kanban,
  CreditCard,
  Info,
  Menu,
  X,
  Sun,
  Moon,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  User
} from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function SidebarLayout({ children, darkMode, setDarkMode }: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const [profile, setProfile] = useState({
    name: 'New Student',
    avatar: '',
    isPremium: false
  });

  useEffect(() => {
    const loadProfile = () => {
      const cached = localStorage.getItem('studentproof_profile');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setProfile({
            name: parsed.name || 'New Student',
            avatar: parsed.avatar || '',
            isPremium: !!parsed.isPremium
          });
        } catch {
          // ignore
        }
      } else {
        setProfile({
          name: 'New Student',
          avatar: '',
          isPremium: false
        });
      }
    };

    loadProfile();
    window.addEventListener('storage', loadProfile);
    return () => {
      window.removeEventListener('storage', loadProfile);
    };
  }, []);

  const renderAvatar = (sizeClass: string, textClass: string = "text-xs") => {
    if (profile.avatar && profile.avatar.startsWith('http')) {
      return (
        <img
          className={`${sizeClass} rounded-full object-cover border border-indigo-500/20`}
          src={profile.avatar}
          alt="Student Avatar"
        />
      );
    }
    const initials = profile.name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .substring(0, 2) || '?';
    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold uppercase ${textClass} border border-indigo-500/20`}>
        {initials}
      </div>
    );
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', href: '/resume-analyzer', icon: FileSearch },
    { name: 'Internship Checker', href: '/internship-checker', icon: ShieldCheck },
    { name: 'Application Gen', href: '/application-generator', icon: FilePlus },
    { name: 'Interview Coach', href: '/interview-coach', icon: Mic },
    { name: 'Presentation Analyzer', href: '/presentation-analyzer', icon: Presentation },
    { name: 'Assignment Explainer', href: '/assignment-explainer', icon: BookOpen },
    { name: 'Career Roadmap', href: '/career-roadmap', icon: Map },
    { name: 'Application Tracker', href: '/application-tracker', icon: Kanban },
    { name: 'Profile Settings', href: '/profile', icon: User },
    { name: 'Pricing Plans', href: '/pricing', icon: CreditCard },
    { name: 'About StudentProof', href: '/about', icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 transition-colors duration-200">
      {/* Brand Header */}
      <div className={`flex items-center justify-between h-16 px-4 border-b border-slate-800`}>
        <Link to="/" className="flex items-center gap-2 text-indigo-400">
          <GraduationCap className="h-8 w-8 flex-shrink-0" />
          {!collapsed && (
            <span className="font-display font-bold text-lg tracking-tight text-white">
              StudentProof
            </span>
          )}
        </Link>
        {/* Toggle Collapse Button (Desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                active
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/10'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
              {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Summary */}
      <div className="p-4 border-t border-slate-800 space-y-4">
        {!collapsed && (
          <div className="bg-slate-800/50 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                {renderAvatar("h-9 w-9", "text-xs")}
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <p className="text-xs text-slate-400 truncate">
                    {profile.isPremium ? 'Premium Student' : 'Free Plan'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          {/* Theme Toggle inside workspace */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center justify-center p-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-slate-400 ${collapsed ? 'w-full' : ''}`}
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {!collapsed && <span className="ml-3 text-sm">Theme Mode</span>}
          </button>
          
          {!collapsed && (
            <Link
              to="/"
              className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Go to Landing Page"
            >
              <LogOut className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-200">
      {/* Desktop Sidebar (Persistent) */}
      <div className={`hidden md:flex flex-col flex-shrink-0 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <SidebarContent />
      </div>

      {/* Mobile Drawer (Overlay) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay background */}
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          {/* Sidebar content container */}
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-slate-900 border-r border-slate-800">
            <div className="absolute top-2 right-2">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar for mobile trigger and path heading */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-display font-semibold text-slate-800 dark:text-white capitalize">
              {location.pathname.replace(/^\//, '').replace(/-/g, ' ') || 'Workspace'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Quick Profile Icon indicator */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-500 dark:text-slate-400">
                {profile.name}
              </span>
              {renderAvatar("h-8 w-8", "text-[10px]")}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Panel content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
            
            {/* Required Workspace Footer Disclaimer */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Disclaimer: StudentProof provides educational guidance and AI-powered recommendations. Students should always perform their own due diligence before accepting opportunities.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
