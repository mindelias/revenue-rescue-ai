'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  AlertTriangle,
  Mail,
  Phone,
  Video,
  FileText,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { ActivityType } from '@/types/activity';
import { formatCurrency, getRiskBadgeClasses } from '@/lib/utils';

export default function ActivitiesPage() {
  const { activities, followUps, completeFollowUp, addActivity, opportunities } = useRevenueStore();
  const [activeTab, setActiveTab] = useState<'FOLLOW_UPS' | 'ACTIVITY_LOG'>('FOLLOW_UPS');
  const [showLogModal, setShowLogModal] = useState(false);

  // New Activity Form State
  const [selectedOppId, setSelectedOppId] = useState(opportunities[0]?.id || '');
  const [activityType, setActivityType] = useState<ActivityType>('CALL');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [activitySentiment, setActivitySentiment] = useState<'POSITIVE' | 'NEUTRAL' | 'CAUTION' | 'NEGATIVE'>('POSITIVE');

  const pendingTasks = followUps.filter((t) => !t.isCompleted);
  const completedTasks = followUps.filter((t) => t.isCompleted);

  const handleCompleteTask = (taskId: string) => {
    completeFollowUp(taskId);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#10b981'],
      });
    } catch {}
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const opp = opportunities.find((o) => o.id === selectedOppId);

    addActivity({
      opportunityId: selectedOppId,
      dealTitle: opp ? `${opp.title} (${opp.company})` : 'General Activity',
      type: activityType,
      title: activityTitle,
      description: activityDesc,
      performedBy: 'Aminat S. (CRO)',
      sentiment: activitySentiment,
      impactSummary: 'Activity logged in revenue stream',
      isAutomated: false,
    });

    setShowLogModal(false);
    setActivityTitle('');
    setActivityDesc('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
              Activity & Smart Cadence Hub
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {pendingTasks.length} Urgent Tasks
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Prioritized follow-up queues ranked by deal risk severity, and real-time revenue telemetry logging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('FOLLOW_UPS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'FOLLOW_UPS'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span>Prioritized Queue ({pendingTasks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('ACTIVITY_LOG')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'ACTIVITY_LOG'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Activity Stream ({activities.length})</span>
            </button>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Log Activity</span>
          </button>
        </div>
      </div>

      {/* Tab: Prioritized Follow-Up Queue */}
      {activeTab === 'FOLLOW_UPS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {pendingTasks.map((task) => {
              const badge = getRiskBadgeClasses(task.dealRiskLevel);
              return (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-xl"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-sm text-white">{task.company}</span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {formatCurrency(task.arr)} ARR
                      </span>
                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {task.dealRiskLevel}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {task.priority.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200">{task.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      💡 Reason: {task.recommendedReason}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Due: {task.dueDate}
                      </span>
                      {task.isOverdue && (
                        <span className="text-[10px] text-rose-400 font-bold">OVERDUE</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Complete</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {pendingTasks.length === 0 && (
              <div className="glass-panel p-12 text-center rounded-2xl text-slate-400 space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">All Follow-ups Cleared!</h3>
                <p className="text-xs">No pending urgent revenue tasks in current queue.</p>
              </div>
            )}
          </div>

          {completedTasks.length > 0 && (
            <div className="pt-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Completed Actions ({completedTasks.length})
              </h4>
              <div className="divide-y divide-slate-800/60 rounded-xl bg-slate-900/40 border border-slate-800/60 overflow-hidden">
                {completedTasks.map((t) => (
                  <div key={t.id} className="p-3 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2 line-through">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>{t.company} — {t.title}</span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400">Resolved</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Full Activity Stream */}
      {activeTab === 'ACTIVITY_LOG' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 divide-y divide-slate-800/60 space-y-4">
          {activities.map((act) => (
            <div key={act.id} className="pt-4 first:pt-0 space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{act.title}</span>
                    {act.isAutomated && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                        AI Automation
                      </span>
                    )}
                    {act.sentiment && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded ${
                          act.sentiment === 'POSITIVE'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : act.sentiment === 'NEGATIVE'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {act.sentiment}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{act.description}</p>
                  {act.impactSummary && (
                    <p className="text-[11px] text-emerald-400 font-medium">⚡ {act.impactSummary}</p>
                  )}
                </div>
                <div className="text-right shrink-0 text-[10px] text-slate-400 font-mono">
                  <div>{act.performedAt}</div>
                  <div className="text-slate-300">{act.performedBy}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Activity Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <form
            onSubmit={handleCreateActivity}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log Revenue Activity</h3>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Associated Opportunity
                </label>
                <select
                  value={selectedOppId}
                  onChange={(e) => setSelectedOppId(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                >
                  {opportunities.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.company} — {o.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Activity Type
                  </label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as ActivityType)}
                    className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="CALL">Phone / Video Call</option>
                    <option value="EMAIL">Outbound Email</option>
                    <option value="MEETING">Customer Meeting</option>
                    <option value="NOTE">Internal Deal Note</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Sentiment Detected
                  </label>
                  <select
                    value={activitySentiment}
                    onChange={(e) =>
                      setActivitySentiment(e.target.value as typeof activitySentiment)
                    }
                    className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="POSITIVE">Positive (High Intent)</option>
                    <option value="NEUTRAL">Neutral</option>
                    <option value="CAUTION">Caution / Minor Pushback</option>
                    <option value="NEGATIVE">Negative (Blocker / Risk)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Architecture Review & Security Alignment"
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Detailed Notes / Interaction Summary
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Document stakeholder quotes, concerns, and next commitments..."
                  value={activityDesc}
                  onChange={(e) => setActivityDesc(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Save to Telemetry</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
