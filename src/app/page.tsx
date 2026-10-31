'use client';

import React, { useEffect, useState } from 'react';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Bell,
  Settings,
  HelpCircle,
  Search,
  Plus,
  ArrowLeft,
  Grid,
  Users,
  Compass,
  FileCheck,
  FolderOpen,
  BarChart3,
  FlaskConical,
  X,
  CheckCircle2,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAssistantStore } from '@/store/assistant-store';
import { ApprovalQueue } from '@/components/ApprovalQueue';
import { AssistantPanel } from '@/components/AssistantPanel';

export default function DashboardPage() {
  const {
    approvals,
    setApprovals,
    searchQuery,
    setSearchQuery,
    activeNav,
    setActiveNav,
    notificationCount,
    toastMessage,
    clearToast,
    showToast,
  } = useAssistantStore();

  const [isAddHelpOpen, setIsAddHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // New approval form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'Folder' | 'Video' | 'PDF' | 'Image'>('PDF');
  const [newSubmitter, setNewSubmitter] = useState('Alex HelpAdmin');

  useEffect(() => {
    fetchApprovals();
  }, [setApprovals]);

  const fetchApprovals = () => {
    fetch('/api/approvals')
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setApprovals(data.items);
          showToast('Approval queue synchronized with Digital Twin.');
        }
      })
      .catch((err) => console.error('Failed to load approvals fixture', err));
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem = {
      id: 'app-' + Date.now(),
      title: newTitle.trim(),
      type: newType,
      submittedBy: newSubmitter,
      date: 'Just now',
      status: 'Pending Review',
      path: 'Custom Workspaces > Field Uploads',
      urgency: 'high' as const,
      priorityScore: 85,
    };

    setApprovals([newItem, ...approvals]);
    setNewTitle('');
    setIsAddHelpOpen(false);
    showToast(`"${newItem.title}" added to pending approvals queue!`);
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-gray-900 overflow-hidden font-sans select-none">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button onClick={clearToast} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Left Navigation Sidebar matching screenshot */}
      <aside className="w-16 border-r border-gray-200 bg-white flex flex-col items-center py-4 justify-between shrink-0 z-20">
        <div className="flex flex-col items-center gap-5 w-full">
          {/* Logo Mark */}
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
            O
          </div>

          {/* Navigation Icons */}
          <nav className="flex flex-col items-center gap-2 w-full">
            <button
              onClick={() => {
                setActiveNav('dashboard');
                showToast('Switched to Overview Dashboard');
              }}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'dashboard' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Dashboard Overview"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setActiveNav('compass');
                showToast('Spatial Navigation Mode');
              }}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'compass' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Spatial Compass"
            >
              <Compass className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setActiveNav('users');
                showToast('Personnel & Role Management');
              }}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'users' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Team & Operators"
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setActiveNav('approvals');
                showToast('Approvals & Auditing view');
              }}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'approvals' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Approvals Workflow"
            >
              <FileCheck className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setActiveNav('folders');
                showToast('Repository Folders & Files');
              }}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'folders' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Content Hierarchy"
            >
              <FolderOpen className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setActiveNav('analytics');
                showToast('Facility Telemetry & Analytics');
              }}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'analytics' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Analytics"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setActiveNav('lab');
                showToast('Digital Twin Experiments Lab');
              }}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                activeNav === 'lab' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Simulation Lab"
            >
              <FlaskConical className="w-5 h-5" />
            </button>
          </nav>
        </div>

        {/* ALLCAD bottom badge */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-[9px] font-mono font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            ALLCAD
          </div>
        </div>
      </aside>

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar matching screenshot */}
        <header className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="text-sm font-extrabold tracking-tight text-gray-900 uppercase">
                OomniEye
              </h1>
              <span className="text-[10px] tracking-widest text-gray-400 uppercase font-semibold">
                Digital Twin Solutions
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={fetchApprovals}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Refresh Queue from API"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 top-10 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl p-3 z-50 text-xs">
                  <div className="flex items-center justify-between font-bold text-gray-900 mb-2 pb-2 border-b border-gray-100">
                    <span>Pending Notifications</span>
                    <button onClick={() => setIsNotificationsOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded bg-rose-50 border border-rose-100 text-rose-900 text-[11px]">
                      <span className="font-bold block">Safety Equipment & Sensor Specs</span>
                      <span>SLA expires in 3 hours. Review pending.</span>
                    </div>
                    <div className="p-2 rounded bg-amber-50 border border-amber-100 text-amber-900 text-[11px]">
                      <span className="font-bold block">Site Patrol Onboarding & Checklists</span>
                      <span>Sam HelpAdmin requested spatial verification.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Button */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Settings Popover */}
              {isSettingsOpen && (
                <div className="absolute right-0 top-10 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50 text-xs space-y-3">
                  <div className="flex items-center justify-between font-bold text-gray-900 pb-2 border-b border-gray-100">
                    <span>Command Centre Settings</span>
                    <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-gray-700">
                      <span>Sound Alerts</span>
                      <input type="checkbox" defaultChecked className="rounded accent-indigo-600" />
                    </label>
                    <label className="flex items-center justify-between text-gray-700">
                      <span>Auto-Refresh Queue</span>
                      <input type="checkbox" defaultChecked className="rounded accent-indigo-600" />
                    </label>
                    <label className="flex items-center justify-between text-gray-700">
                      <span>Digital Twin High-FPS</span>
                      <input type="checkbox" defaultChecked className="rounded accent-indigo-600" />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Operator Avatar */}
            <div
              onClick={() => showToast('Operator: Kunal (Admin / Reviewer Level 2)')}
              className="w-8 h-8 rounded-full bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-amber-400"
              title="Operator Kunal"
            >
              R
            </div>
          </div>
        </header>

        {/* Sub Header matching screenshot */}
        <div className="px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                showToast('Approvals & Review filter reset');
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-xs cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </button>

            <h2 className="text-base font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              Approvals & Review
              <HelpCircle
                onClick={() => showToast('This view displays digital-twin verification requests awaiting operator sign-off.')}
                className="w-4 h-4 text-gray-400 hover:text-gray-700 cursor-pointer"
              />
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Search Input */}
            <div className="relative w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search approvals by title, author, folder, or page..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Add Help / New Approval Modal Button */}
            <button
              onClick={() => setIsAddHelpOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add help
            </button>
          </div>
        </div>

        {/* Add Help Request Modal */}
        {isAddHelpOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Submit New Approval Request
                </h3>
                <button onClick={() => setIsAddHelpOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddNewItem} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Content / Asset Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zone 5 Hazardous Equipment Inspection"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Asset Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="Folder">Folder</option>
                      <option value="Video">Video</option>
                      <option value="PDF">PDF</option>
                      <option value="Image">Image</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Submitter Admin</label>
                    <select
                      value={newSubmitter}
                      onChange={(e) => setNewSubmitter(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="Sam HelpAdmin">Sam HelpAdmin</option>
                      <option value="Alex HelpAdmin">Alex HelpAdmin</option>
                      <option value="Elena HelpAdmin">Elena HelpAdmin</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddHelpOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                  >
                    Submit to Queue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dashboard Workspace */}
        <main className="flex-1 px-6 pb-6 overflow-hidden flex flex-col min-h-0 relative">
          <ApprovalQueue />
        </main>

        {/* Floating Approvals Assistant Widget */}
        <AssistantPanel />
      </div>
    </div>
  );
}
