'use client';

import React, { useEffect, useState } from 'react';
import {
  RotateCcw,
  Maximize2,
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
} from 'lucide-react';
import { useAssistantStore } from '@/store/assistant-store';
import { ApprovalQueue } from '@/components/ApprovalQueue';
import { AssistantPanel } from '@/components/AssistantPanel';

export default function DashboardPage() {
  const { setApprovals } = useAssistantStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/approvals')
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setApprovals(data.items);
        }
      })
      .catch((err) => console.error('Failed to load approvals fixture', err));
  }, [setApprovals]);

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-gray-900 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <aside className="w-16 border-r border-gray-200 bg-white flex flex-col items-center py-4 justify-between shrink-0">
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Logo mark */}
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            O
          </div>

          {/* Navigation icons */}
          <nav className="flex flex-col items-center gap-3 w-full">
            <button className="p-2.5 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
              <Grid className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <Compass className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <Users className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <FileCheck className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <FolderOpen className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <BarChart3 className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <FlaskConical className="w-5 h-5" />
            </button>
          </nav>
        </div>

        <div className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
          ALLCAD
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between shrink-0">
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

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
              <Settings className="w-4 h-4" />
            </button>
            <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              R
            </div>
          </div>
        </header>

        {/* Sub Header with Search and Actions */}
        <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </button>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              Approvals & Review
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-pointer" />
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search approvals by title, author, folder, or page..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Add help
            </button>
          </div>
        </div>

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
