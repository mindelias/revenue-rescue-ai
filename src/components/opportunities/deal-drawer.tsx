'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Send,
  CheckCircle2,
  BrainCircuit,
  ArrowRight,
  TrendingDown,
  Building,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Opportunity, RescuePlaybook, DealStage } from '@/types/opportunity';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { formatCurrency, getRiskBadgeClasses } from '@/lib/utils';

interface DealDrawerProps {
  opportunity: Opportunity | null;
  onClose: () => void;
}

const STAGES: Array<{ id: DealStage; label: string }> = [
  { id: 'DISCOVERY', label: 'Discovery' },
  { id: 'SOLUTION_MAPPING', label: 'Solution Mapping' },
  { id: 'PROPOSAL_OUT', label: 'Proposal Out' },
  { id: 'EXECUTIVE_REVIEW', label: 'Exec Review' },
  { id: 'LEGAL_SECURITY', label: 'Legal & Security' },
  { id: 'CLOSED_WON', label: 'Closed Won' },
  { id: 'CLOSED_LOST', label: 'Closed Lost' },
];

export function DealDrawer({ opportunity, onClose }: DealDrawerProps) {
  const { executeRescuePlaybook, updateOpportunityStage } = useRevenueStore();
  const [selectedPlaybook, setSelectedPlaybook] = useState<RescuePlaybook | null>(
    opportunity?.recommendedPlaybooks[0] || null
  );
  const [customBody, setCustomBody] = useState(
    opportunity?.recommendedPlaybooks[0]?.draftedPayload?.body ||
      opportunity?.recommendedPlaybooks[0]?.description ||
      ''
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!opportunity) return null;

  const riskBadge = getRiskBadgeClasses(opportunity.riskLevel);

  const handleExecute = () => {
    if (!selectedPlaybook) return;
    setIsExecuting(true);
    setTimeout(() => {
      executeRescuePlaybook(opportunity.id, selectedPlaybook.id, customBody);
      setIsExecuting(false);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#6366f1'],
        });
      } catch {}
      setSuccessMsg('Rescue Playbook dispatched! Risk score reduced.');
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 700);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0b0e14] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-start justify-between bg-[#090b10]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-emerald-400" />
                {opportunity.industry}
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}
              >
                {opportunity.riskLevel} RISK ({opportunity.riskScore}%)
              </span>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {opportunity.inactivityDays}d silent
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{opportunity.company}</h2>
            <p className="text-xs text-slate-300">{opportunity.title}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Metrics & Stage Progress */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Deal ARR
              </span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {formatCurrency(opportunity.arr)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Health Index
              </span>
              <span className="text-lg font-bold font-mono text-white">
                {opportunity.healthScore} / 100
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Days in Stage
              </span>
              <span className="text-lg font-bold font-mono text-white">
                {opportunity.daysInStage} days
              </span>
            </div>
          </div>

          {/* Stage Progression Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Deal Pipeline Stage
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {STAGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => updateOpportunityStage(opportunity.id, s.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-center transition-all cursor-pointer ${
                    opportunity.stage === s.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Deal Summary */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ShieldAlert className="h-4 w-4" />
              <span>AI Revenue Leakage Diagnosis</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{opportunity.summary}</p>
          </div>

          {/* AI Deal Memory Context */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <BrainCircuit className="h-4 w-4" />
              <span>AI Deal Memory Snippet</span>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              "{opportunity.dealMemorySnippet}"
            </p>
          </div>

          {/* Detected Risk Factors */}
          {opportunity.riskFactors.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Detected Risk Factors ({opportunity.riskFactors.length})
              </h4>
              <div className="space-y-2">
                {opportunity.riskFactors.map((rf) => (
                  <div
                    key={rf.id}
                    className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/25 flex items-start gap-3"
                  >
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rose-300">{rf.title}</span>
                        <span className="text-[10px] font-mono font-bold text-rose-400">
                          [{rf.severity}]
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{rf.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stakeholders Matrix */}
          {opportunity.stakeholders.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Stakeholder Engagement Matrix
              </h4>
              <div className="divide-y divide-slate-800/60 rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
                {opportunity.stakeholders.map((sh) => (
                  <div key={sh.id} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{sh.name}</div>
                      <div className="text-slate-400 text-[11px]">{sh.title}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          sh.role === 'CHAMPION'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : sh.role === 'BLOCKER'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {sh.role}
                      </span>
                      <span className="text-[10px] text-slate-400">{sh.sentiment}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rescue Playbooks Launcher */}
          {opportunity.recommendedPlaybooks.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" />
                  Trigger Rescue Playbook
                </h4>
              </div>

              <div className="space-y-2">
                {opportunity.recommendedPlaybooks.map((pb) => (
                  <button
                    key={pb.id}
                    onClick={() => {
                      setSelectedPlaybook(pb);
                      setCustomBody(pb.draftedPayload?.body || pb.description);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedPlaybook?.id === pb.id
                        ? 'bg-emerald-500/10 border-emerald-500/40'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{pb.title}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {pb.estimatedRecoveryChance}% Recovery Win-rate
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{pb.description}</p>
                  </button>
                ))}
              </div>

              {selectedPlaybook && (
                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tailored Outreach Payload
                  </label>
                  <textarea
                    rows={4}
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  />
                  <button
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isExecuting ? 'Dispatching...' : 'Dispatch Rescue Action'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
