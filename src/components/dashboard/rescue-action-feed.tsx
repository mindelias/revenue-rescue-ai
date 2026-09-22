'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle, ShieldAlert, Send, Clock, UserCheck, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { Opportunity, RescuePlaybook } from '@/types/opportunity';
import { formatCurrency, getRiskBadgeClasses } from '@/lib/utils';

export function RescueActionFeed() {
  const { opportunities, executeRescuePlaybook } = useRevenueStore();
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [activePlaybook, setActivePlaybook] = useState<RescuePlaybook | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Find all deals that have recommended playbooks
  const atRiskDealsWithPlaybooks = opportunities.filter(
    (o) => o.recommendedPlaybooks.length > 0 && o.stage !== 'CLOSED_WON'
  );

  const handleOpenModal = (opp: Opportunity, playbook: RescuePlaybook) => {
    setSelectedOpp(opp);
    setActivePlaybook(playbook);
    setCustomMessage(playbook.draftedPayload?.body || playbook.description);
  };

  const handleExecute = () => {
    if (!selectedOpp || !activePlaybook) return;
    setIsExecuting(true);

    setTimeout(() => {
      executeRescuePlaybook(selectedOpp.id, activePlaybook.id, customMessage);
      setIsExecuting(false);
      setSelectedOpp(null);
      setActivePlaybook(null);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#6366f1', '#f59e0b'],
        });
      } catch {
        // Safe fallback
      }

      setSuccessToast(`Successfully executed ${activePlaybook.title}! Risk score dropped by 30 pts.`);
      setTimeout(() => setSuccessToast(''), 6000);
    }, 800);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              High-Impact Revenue Rescue Playbooks
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous next-best actions predicted to prevent pipeline leakage
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
          {atRiskDealsWithPlaybooks.length} actionable deals
        </span>
      </div>

      {successToast && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="h-4 w-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Playbook Items */}
      <div className="space-y-3">
        {atRiskDealsWithPlaybooks.map((opp) => {
          const playbook = opp.recommendedPlaybooks[0];
          const badge = getRiskBadgeClasses(opp.riskLevel);
          const isExecuted = playbook.executed;

          return (
            <div
              key={opp.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                    {opp.company}
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-400">
                    {formatCurrency(opp.arr)} ARR
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    {opp.riskLevel} RISK ({opp.riskScore}%)
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {opp.inactivityDays}d silent
                  </span>
                </div>

                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-emerald-400 font-semibold shrink-0">Playbook:</span>
                  <span>{playbook.title} — {playbook.description}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                    Recovery Chance
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    {playbook.estimatedRecoveryChance}%
                  </span>
                </div>

                {isExecuted ? (
                  <div className="px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    <span>Dispatched</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenModal(opp, playbook)}
                    className="h-9 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Execute Rescue</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Playbook Execution Modal Drawer */}
      {selectedOpp && activePlaybook && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Execute Rescue Playbook</h3>
                  <p className="text-xs text-slate-400">
                    Target: <span className="text-slate-200 font-semibold">{selectedOpp.company}</span> ({formatCurrency(selectedOpp.arr)} ARR)
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedOpp(null);
                  setActivePlaybook(null);
                }}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded bg-slate-800"
              >
                Esc / Close
              </button>
            </div>

            {/* Playbook Details */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Strategic Objective
                </span>
                <p className="text-xs font-semibold text-slate-200">{activePlaybook.title}</p>
                <p className="text-xs text-slate-400">{activePlaybook.description}</p>
              </div>

              {/* Subject */}
              {activePlaybook.draftedPayload?.subject && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    defaultValue={activePlaybook.draftedPayload.subject}
                    className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              )}

              {/* AI Drafted Message Payload */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  AI Drafted Outreach Payload (Editable)
                </label>
                <textarea
                  rows={6}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50 leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-emerald-400" />
                Estimated Win-Back Impact: <strong className="text-white">{activePlaybook.estimatedRecoveryChance}%</strong>
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    setSelectedOpp(null);
                    setActivePlaybook(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isExecuting ? 'Dispatching...' : 'Dispatch Rescue Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
