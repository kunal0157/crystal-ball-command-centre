'use client';

import React, { useState } from 'react';
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
  FolderTree,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck,
  ShieldAlert,
  Download,
} from 'lucide-react';
import { useAssistantStore } from '@/store/assistant-store';
import { ApprovalItem } from '@/lib/schemas';

export function ApprovalQueue() {
  const {
    approvals,
    selectedItem,
    setSelectedItem,
    searchQuery,
    activeView,
    setActiveView,
    activeTab,
    setActiveTab,
    approveItem,
    rejectItem,
    showToast,
  } = useAssistantStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Filter approvals by search
  const filteredApprovals = approvals.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.submittedBy.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.path.toLowerCase().includes(q)
    );
  });

  const getTypeIcon = (type: ApprovalItem['type']) => {
    switch (type) {
      case 'Folder':
        return <Folder className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'Video':
        return <Video className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'PDF':
        return <FileText className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'Image':
        return <ImageIcon className="w-4 h-4 text-emerald-500 shrink-0" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400 shrink-0" />;
    }
  };

  const getUrgencyBadge = (item: ApprovalItem) => {
    if (item.status === 'Approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Check className="w-3 h-3" /> Approved
        </span>
      );
    }
    if (item.status === 'Rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <X className="w-3 h-3" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
        Pending Review
      </span>
    );
  };

  // Mock Patrol History Log for Digital Twin Viewer
  const patrolLogs = [
    { id: 'P-4', date: 'May 1, 2026, 6:05 PM', name: 'KL-Architecture... ', session: 'S-002' },
    { id: 'P-3', date: 'May 1, 2026, 4:22 PM', name: 'KL-Architecture... ', session: 'S-001' },
    { id: 'P-2', date: 'Apr 30, 2026, 6:06 PM', name: 'KL-Architecture... ', session: 'S-002' },
    { id: 'P-1', date: 'Apr 30, 2026, 2:02 PM', name: 'KL-Architecture... ', session: 'S-001' },
  ];

  const currentItem = selectedItem || approvals[0];

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 overflow-hidden">
      {/* LEFT COLUMN: Approvals Queue List (Takes 7 cols on desktop) */}
      <div className="lg:col-span-7 flex flex-col bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Toolbar matching reference screenshot */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
              <ListFilter className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-extrabold tracking-wider text-gray-900 uppercase">
              Pending Approval Requests
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
              {filteredApprovals.length} items
            </span>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs font-medium text-gray-600">
            <button
              onClick={() => setActiveView('queue')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                activeView === 'queue'
                  ? 'bg-white shadow-xs text-gray-900 font-bold'
                  : 'hover:text-gray-900'
              }`}
            >
              Queue View
            </button>
            <button
              onClick={() => setActiveView('hierarchy')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                activeView === 'hierarchy'
                  ? 'bg-white shadow-xs text-gray-900 font-bold'
                  : 'hover:text-gray-900'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              Hierarchy View
            </button>
          </div>
        </div>

        {/* View Mode: Queue Flat Table vs Hierarchy Tree */}
        {activeView === 'queue' ? (
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold text-gray-500 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-xs">
                  <th className="py-2.5 px-4">Folder / Content Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Submitted By</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredApprovals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      No approvals match your filter query.
                    </td>
                  </tr>
                ) : (
                  filteredApprovals.map((item) => {
                    const isSelected = currentItem?.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`group cursor-pointer transition-colors relative ${
                          isSelected ? 'bg-indigo-50/70 border-l-4 border-l-indigo-600' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-2.5">
                            <div className="p-1 rounded bg-gray-100/80 mt-0.5">
                              {getTypeIcon(item.type)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-gray-900 truncate">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-gray-400 truncate">
                                {item.path}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700">
                            {item.type}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-medium text-gray-700">
                          {item.submittedBy}
                        </td>

                        <td className="py-3 px-3 font-mono text-gray-500 text-[11px]">
                          {item.date}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {getUrgencyBadge(item)}
                        </td>

                        <td className="py-3 px-3 text-right relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === item.id ? null : item.id);
                            }}
                            className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200 cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Row Action Dropdown */}
                          {activeMenuId === item.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-3 top-8 w-44 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-30 text-xs font-medium"
                            >
                              <button
                                onClick={() => {
                                  approveItem(item.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-emerald-700 flex items-center gap-2 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve Item
                              </button>
                              <button
                                onClick={() => {
                                  rejectItem(item.id, 'Discrepancy in coordinate alignment');
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-700 flex items-center gap-2 cursor-pointer"
                              >
                                <ShieldAlert className="w-3.5 h-3.5" /> Reject with Note
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setActiveTab('snapshot');
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-gray-100 text-gray-700 flex items-center gap-2 cursor-pointer"
                              >
                                <Camera className="w-3.5 h-3.5" /> Inspect 3D Scene
                              </button>
                              <button
                                onClick={() => {
                                  showToast(`Downloading asset archive for ${item.title}...`);
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-gray-100 text-gray-700 flex items-center gap-2 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" /> Download Package
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Hierarchy Tree View */
          <div className="flex-1 overflow-auto p-4 space-y-3">
            <div className="text-xs font-semibold text-gray-500 mb-2">Facility Workspaces Root</div>
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <ChevronDown className="w-4 h-4 text-gray-500" />
                <Folder className="w-4 h-4 text-amber-500" />
                <span>My Site Patrol (Zone Alpha)</span>
              </div>
              <div className="pl-6 space-y-1.5">
                <div
                  onClick={() => setSelectedItem(approvals[0])}
                  className="p-2 rounded bg-white border border-gray-200 hover:border-indigo-400 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Folder className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-semibold text-gray-800">Site Patrol Onboarding & Checklists</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                    High Urgency
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <ChevronDown className="w-4 h-4 text-gray-500" />
                <Folder className="w-4 h-4 text-amber-500" />
                <span>Drawing-Videos & Spatial Models</span>
              </div>
              <div className="pl-6 space-y-1.5">
                <div
                  onClick={() => setSelectedItem(approvals[1])}
                  className="p-2 rounded bg-white border border-gray-200 hover:border-indigo-400 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-rose-500" />
                    <span className="font-semibold text-gray-800">Level 2 Drone Patrol Video Demo</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                    Medium
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Screen Snapshot Target & Detail View (Takes 5 cols on desktop) */}
      <div className="lg:col-span-5 flex flex-col bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        {/* Top Breadcrumb & Control Action Buttons */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/60">
          <div className="text-[11px] text-gray-500 font-medium mb-1.5 truncate">
            {currentItem?.path} &gt; <span className="text-gray-900 font-semibold">{currentItem?.title}</span>
          </div>

          <h3 className="text-sm font-extrabold text-gray-900 tracking-tight leading-tight">
            {currentItem?.title}
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
            Standard operating procedures, emergency drill routes, and field technician check-in checklists.
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setActiveTab('snapshot')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'snapshot'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              Snapshot & Control
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Media / Content
            </button>
          </div>
        </div>

        {/* Interactive Screen Snapshot Target Container */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>Screen Snapshot Target</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <button
                onClick={() => setZoomLevel((z) => Math.min(160, z + 15))}
                className="p-1 rounded hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                className="p-1 rounded hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-semibold px-1 text-gray-500">{zoomLevel}%</span>
            </div>
          </div>

          {/* Tab 1: Screen Snapshot Target (Digital Twin Blueprint Canvas matching screenshot) */}
          {activeTab === 'snapshot' ? (
            <div className="flex-1 flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-slate-900 text-white shadow-inner">
              {/* Live Blueprint HUD Overlay */}
              <div
                className="relative flex-1 bg-slate-950 p-3 overflow-hidden flex flex-col justify-between transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
              >
                {/* Blueprint grid lines simulation */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, #6366f1 1px, transparent 1px), linear-gradient(to right, #334155 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Header status in HUD */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 z-10">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE DIGITAL TWIN: Zone P-4
                  </span>
                  <span>Spatial Latency: 12ms</span>
                </div>

                {/* Purple Target Bounding Box from reference screenshot */}
                <div className="my-auto mx-auto border-2 border-purple-500 bg-purple-950/60 rounded-md p-3 text-center shadow-lg shadow-purple-950/50 max-w-[260px] z-10">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-purple-300">
                    Inspected Target Region
                  </div>
                  <div className="text-xs font-extrabold text-white mt-1">
                    {currentItem?.title}
                  </div>
                  <div className="text-[10px] font-mono text-purple-200/80 mt-1">
                    Coord: [45.182, 12.839, 1.200]
                  </div>
                  <div className="mt-2.5 flex justify-center gap-1.5">
                    <button
                      onClick={() => approveItem(currentItem.id)}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectItem(currentItem.id)}
                      className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between z-10">
                  <span>LiDAR Calibration: 99.8%</span>
                  <span className="text-indigo-400">FPS: 60.0</span>
                </div>
              </div>

              {/* Patrol Logs Mini Table at Bottom of Target */}
              <div className="border-t border-slate-800 bg-slate-900/90 text-xs">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                      <th className="py-1 px-3">ID</th>
                      <th className="py-1 px-2">Date</th>
                      <th className="py-1 px-2">Name</th>
                      <th className="py-1 px-2 text-right">Session</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                    {patrolLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40">
                        <td className="py-1 px-3 text-indigo-400 font-bold">{log.id}</td>
                        <td className="py-1 px-2">{log.date}</td>
                        <td className="py-1 px-2 truncate max-w-[100px]">{log.name}</td>
                        <td className="py-1 px-2 text-right text-slate-400">{log.session}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Tab 2: Interactive Media / Content Player View */
            <div className="flex-1 flex flex-col border border-gray-200 rounded-lg p-4 bg-gray-50 justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-800 mb-2">
                  <span>Media Asset Preview</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    {currentItem?.type} Asset
                  </span>
                </div>

                {currentItem?.type === 'Video' ? (
                  <div className="rounded-lg bg-black text-white p-4 flex flex-col items-center justify-center h-40 relative group">
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs transition-transform transform hover:scale-110 cursor-pointer"
                    >
                      {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-gray-300">
                      <span>{isVideoPlaying ? '00:14 / 02:40' : '00:00 / 02:40'}</span>
                      <span>Drone Telemetry Camera [Cam-04]</span>
                    </div>
                  </div>
                ) : currentItem?.type === 'PDF' ? (
                  <div className="rounded-lg bg-white border border-gray-200 p-4 space-y-2 text-xs shadow-xs">
                    <div className="flex items-center gap-2 text-blue-600 font-bold">
                      <FileText className="w-5 h-5" />
                      <span>Safety_Equipment_Sensor_Specs_v2.pdf</span>
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed">
                      OSHA Certified Sensor calibration thresholds, optical lens specs, and infrared thermal limits for Zone 4.
                    </p>
                    <div className="text-[10px] text-gray-400 font-mono">Size: 4.2 MB • Author: Sam HelpAdmin</div>
                  </div>
                ) : currentItem?.type === 'Image' ? (
                  <div className="rounded-lg bg-emerald-950 text-emerald-200 p-4 flex flex-col items-center justify-center h-40 border border-emerald-800">
                    <ImageIcon className="w-8 h-8 text-emerald-400 mb-2" />
                    <span className="text-xs font-bold">360° LiDAR Spatial Layout Active</span>
                    <span className="text-[10px] text-emerald-400 mt-1 font-mono">Dimensions: 8192 x 4096 px</span>
                  </div>
                ) : (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <Folder className="w-4 h-4 text-amber-600" />
                      <span>Onboarding Checklist Bundle (6 items)</span>
                    </div>
                    <ul className="list-disc list-inside text-gray-600 text-[11px] space-y-0.5 pl-1">
                      <li>technician_signoff_sheet.pdf</li>
                      <li>zone_hazard_inspection_guide.md</li>
                      <li>evacuation_route_camera_pins.json</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => showToast(`Asset ${currentItem.title} verified and signed.`)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                >
                  Verify Compliance
                </button>
                <button
                  onClick={() => approveItem(currentItem.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  Quick Sign-off
                </button>
              </div>
            </div>
          )}

          {/* Reference Footer Link matching screenshot */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
            <span>Help Admin View — Approvals and rejections are audited.</span>
            <button
              onClick={() => showToast('Opening HMS Audit Log Viewer...')}
              className="font-bold text-gray-700 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
            >
              HMS Panel <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
