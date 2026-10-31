'use client';

import React from 'react';
import {
  FileText,
  Video,
  Folder,
  Image as ImageIcon,
  MoreVertical,
  CheckCircle2,
  Clock,
  Layers,
  ListFilter,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { useAssistantStore } from '@/store/assistant-store';
import { ApprovalItem } from '@/lib/schemas';

export function ApprovalQueue() {
  const { approvals, selectedItem, setSelectedItem } = useAssistantStore();

  const getTypeIcon = (type: ApprovalItem['type']) => {
    switch (type) {
      case 'Folder':
        return <Folder className="w-5 h-5 text-amber-500" />;
      case 'Video':
        return <Video className="w-5 h-5 text-rose-500" />;
      case 'PDF':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'Image':
        return <ImageIcon className="w-5 h-5 text-emerald-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getUrgencyBadge = (item: ApprovalItem) => {
    if (item.urgency === 'high' || item.title.includes('Safety') || item.title.includes('Checklist')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          High Urgency
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        Review Pending
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Top Breadcrumb & Status Header */}
      <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <span className="hover:text-gray-900 cursor-pointer">My Site Patrol</span>
            <span>&gt;</span>
            <span className="hover:text-gray-900 cursor-pointer">My Site Patrol Card</span>
            <span>&gt;</span>
            <span className="text-gray-900 font-semibold">Site Patrol Onboarding & Checklists</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-xs">
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            Snapshot & Control
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Media / Content
          </button>
        </div>
      </div>

      {/* Queue Toolbar */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded bg-indigo-50 text-indigo-600">
            <ListFilter className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold tracking-tight text-gray-900 uppercase">
            Pending Approval Requests
          </h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {approvals.length} items
          </span>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs font-medium text-gray-600">
          <button className="px-3 py-1 rounded-md bg-white shadow-xs text-gray-900 font-semibold">
            Queue View
          </button>
          <button className="px-3 py-1 rounded-md hover:text-gray-900">
            Hierarchy View
          </button>
        </div>
      </div>

      {/* Table list */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-5">Folder / Content Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Submitted By</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {approvals.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-50/60' : 'hover:bg-gray-50/80'
                  }`}
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 group-hover:border-gray-200 mt-0.5">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          {item.title}
                          {getUrgencyBadge(item)}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.path}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-600 font-medium">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-700 font-medium">
                    {item.submittedBy}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-500 font-mono">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100/70 text-amber-900">
                      <Clock className="w-3 h-3 text-amber-600" />
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Screen Snapshot Preview Section */}
      <div className="mt-auto p-5 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <Camera className="w-4 h-4 text-indigo-600" />
            Screen Snapshot Target
          </div>
          <span className="text-xs text-gray-500">Live 3D Digital Twin Synchronizer</span>
        </div>

        <div className="relative rounded-lg border border-gray-200 bg-slate-900 text-slate-100 p-4 overflow-hidden h-36 flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400">
                ZONE ACTIVE: Spatial Zone P-4
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">FPS: 60 | Latency: 14ms</span>
          </div>

          <div className="border border-indigo-500/50 rounded p-2.5 bg-indigo-950/40 text-xs">
            <div className="font-semibold text-indigo-300">
              {selectedItem ? selectedItem.title : 'Site Patrol Onboarding & Checklists'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Target coordinate anchored: [45.182, 12.839, 1.200] — Status: Verified
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Help Admin View — Approvals and rejections are audited.</span>
            <span className="text-indigo-400 font-medium flex items-center gap-1">
              HMS Panel <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
