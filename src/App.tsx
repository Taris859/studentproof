import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SidebarLayout from './components/SidebarLayout';

// Public Pages
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import About from './pages/About';

// Workspace Pages
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import InternshipChecker from './pages/InternshipChecker';
import ApplicationGenerator from './pages/ApplicationGenerator';
import InterviewCoach from './pages/InterviewCoach';
import PresentationAnalyzer from './pages/PresentationAnalyzer';
import AssignmentExplainer from './pages/AssignmentExplainer';
import CareerRoadmap from './pages/CareerRoadmap';
import ApplicationTracker from './pages/ApplicationTracker';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Wrapper for public routing layouts
function PublicLayout({ children, darkMode, setDarkMode }: { children: React.ReactNode; darkMode: boolean; setDarkMode: (dark: boolean) => void }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Global App entry
export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const cached = localStorage.getItem('theme');
    if (cached) return cached === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Landing Routes */}
        <Route
          path="/"
          element={
            <PublicLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/pricing"
          element={
            <PublicLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <Pricing />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <About />
            </PublicLayout>
          }
        />

        {/* Private Workspace Routes */}
        <Route
          path="/dashboard"
          element={
            <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <Dashboard />
            </SidebarLayout>
          }
        />
        <Route
          path="/resume-analyzer"
          element={
            <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <ResumeAnalyzer />
            </SidebarLayout>
          }
        />
        <Route
          path="/internship-checker"
          element={
            <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <InternshipChecker />
            </SidebarLayout>
          }
        />
        <Route
          path="/application-generator"
          element={
            <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <ApplicationGenerator />
            </SidebarLayout>
          }
        />
        <Route
          path="/interview-coach"
          element={
            <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <InterviewCoach />
            </SidebarLayout>
          }
        />
        <Route
          path="/presentation-analyzer"
          element={
            <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <PresentationAnalyzer />
            </SidebarLayout>
          }
        />
        <Route
          path="/assignment-explainer"
          element={
            <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <AssignmentExplainer />
            </SidebarLayout>
          }
        />
        <Route
          path="/career-roadmap"
          element={
            <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <CareerRoadmap />
            </SidebarLayout>
          }
        />
        <Route
          path="/application-tracker"
          element={
            <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <ApplicationTracker />
            </SidebarLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
