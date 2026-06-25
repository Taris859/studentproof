import React, { useState, useEffect } from 'react';
import { Kanban, Plus, Trash2, Edit2, Calendar, FileText, ChevronRight, ChevronLeft } from 'lucide-react';

interface Application {
  id: string;
  company: string;
  role: string;
  deadline: string;
  notes: string;
  status: 'Interested' | 'Applied' | 'Interview' | 'Shortlisted' | 'Rejected' | 'Selected';
}

const COLUMNS: { id: Application['status']; label: string; color: string }[] = [
  { id: 'Interested', label: 'Interested', color: 'border-t-slate-400 bg-slate-100/50 dark:bg-slate-900/30' },
  { id: 'Applied', label: 'Applied', color: 'border-t-blue-500 bg-blue-50/10 dark:bg-blue-950/10' },
  { id: 'Interview', label: 'Interview', color: 'border-t-amber-500 bg-amber-50/10 dark:bg-amber-950/10' },
  { id: 'Shortlisted', label: 'Shortlisted', color: 'border-t-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10' },
  { id: 'Rejected', label: 'Rejected', color: 'border-t-red-500 bg-red-50/10 dark:bg-red-950/10' },
  { id: 'Selected', label: 'Selected', color: 'border-t-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10' }
];

const DEFAULT_APPLICATIONS: Application[] = [
  { id: '1', company: 'Google', role: 'Software Engineering Intern', deadline: '2026-07-15', notes: 'Need to prepare for DSA round.', status: 'Interview' },
  { id: '2', company: 'Stripe', role: 'Frontend Developer Intern', deadline: '2026-07-20', notes: 'Submitted resume. Followed up on LinkedIn.', status: 'Applied' },
  { id: '3', company: 'Linear', role: 'Product Design Intern', deadline: '2026-08-01', notes: 'Portfolio under review.', status: 'Interested' },
  { id: '4', company: 'Vercel', role: 'Developer Relations Intern', deadline: '2026-06-30', notes: 'Got short-listed for video intro.', status: 'Shortlisted' }
];

export default function ApplicationTracker() {
  const [apps, setApps] = useState<Application[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  // Form states
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Application['status']>('Interested');

  // Load from local storage
  useEffect(() => {
    const cached = localStorage.getItem('studentproof_applications');
    if (cached) {
      try {
        setApps(JSON.parse(cached));
      } catch {
        setApps(DEFAULT_APPLICATIONS);
      }
    } else {
      localStorage.setItem('studentproof_applications', JSON.stringify(DEFAULT_APPLICATIONS));
      setApps(DEFAULT_APPLICATIONS);
    }
  }, []);

  // Save to local storage
  const saveApps = (updated: Application[]) => {
    setApps(updated);
    localStorage.setItem('studentproof_applications', JSON.stringify(updated));
  };

  const handleOpenAddModal = (colId: Application['status']) => {
    setEditingApp(null);
    setCompany('');
    setRole('');
    setDeadline(new Date().toISOString().split('T')[0]);
    setNotes('');
    setStatus(colId);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (app: Application) => {
    setEditingApp(app);
    setCompany(app.company);
    setRole(app.role);
    setDeadline(app.deadline);
    setNotes(app.notes);
    setStatus(app.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    if (editingApp) {
      // Edit
      const updated = apps.map((a) =>
        a.id === editingApp.id
          ? { ...a, company, role, deadline, notes, status }
          : a
      );
      saveApps(updated);
    } else {
      // Create new
      const newApp: Application = {
        id: Date.now().toString(),
        company,
        role,
        deadline,
        notes,
        status
      };
      saveApps([...apps, newApp]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = apps.filter((a) => a.id !== id);
    saveApps(updated);
  };

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCol: Application['status']) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;

    const updated = apps.map((a) =>
      a.id === id ? { ...a, status: targetCol } : a
    );
    saveApps(updated);
  };

  const moveCard = (app: Application, direction: 'left' | 'right') => {
    const currentIndex = COLUMNS.findIndex((c) => c.id === app.status);
    let targetIndex = currentIndex;
    if (direction === 'left' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (direction === 'right' && currentIndex < COLUMNS.length - 1) {
      targetIndex = currentIndex + 1;
    }

    if (targetIndex !== currentIndex) {
      const targetCol = COLUMNS[targetIndex].id;
      const updated = apps.map((a) =>
        a.id === app.id ? { ...a, status: targetCol } : a
      );
      saveApps(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Kanban className="h-5 w-5 text-indigo-500" />
            Job & Internship Tracker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Drag cards between columns or use the click control arrows to progress your application lifecycle.
          </p>
        </div>
        <button
          onClick={() => handleOpenAddModal('Interested')}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </button>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto pb-4 items-start min-h-[500px]">
        {COLUMNS.map((col) => {
          const colApps = apps.filter((a) => a.status === col.id);
          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`border border-slate-200 dark:border-slate-800 border-t-4 rounded-xl flex flex-col p-3 shadow-sm min-h-[400px] lg:min-h-[500px] transition-colors duration-200 ${col.color}`}
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">{col.label}</span>
                <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-[10px] font-bold rounded-full text-slate-600 dark:text-slate-400">
                  {colApps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3">
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app.id)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-4 rounded-lg shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all space-y-3"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{app.company}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{app.role}</p>
                    </div>

                    {app.notes && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-950 p-1.5 rounded">
                        {app.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span>{app.deadline}</span>
                    </div>

                    {/* Actions and move toggles */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      {/* Left/Right controls for easier keyboard/tablet usage */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveCard(app, 'left')}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          title="Move Left"
                        >
                          <ChevronLeft className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => moveCard(app, 'right')}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          title="Move Right"
                        >
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Edit/Delete */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(app)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {colApps.length === 0 && (
                  <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-lg p-6 text-center text-[10px] text-slate-400 flex flex-col justify-center items-center h-24">
                    <FileText className="h-4 w-4 text-slate-300 dark:text-slate-700 mb-1" />
                    <span>Drop here</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full shadow-2xl p-6 transition-all">
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white mb-4">
              {editingApp ? 'Edit Application Record' : 'Add Internship / Job Application'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Role / Position *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer Intern"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Application['status'])}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {COLUMNS.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Notes / Action Plan</label>
                <textarea
                  placeholder="Need to finish portfolio edit before HR submission..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
