'use client';

import React from 'react';
import { ShieldAlert, TrendingUp, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { cn } from '@/lib/utils';

export function RevenueHealthGauge() {
  const { getRevenueHealthMetrics } = useRevenueStore();
  const metrics = getRevenueHealthMetrics();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 stroke-emerald-500';
    if (score >= 60) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  const getHealthDescriptor = (score: number) => {
    if (score >= 85) return { label: 'Optimal Health', note: 'Pipeline velocity high, leakage minimal' };
    if (score >= 70) return { label: 'Stable with Moderate Risk', note: 'Action required on 2 stalled enterprise deals' };
    if (score >= 50) return { label: 'Elevated Leakage Alert', note: 'Critical inactivity detected on key revenue targets' };
    return { label: 'Critical Risk', note: 'Immediate multi-threading rescue required' };
  };

  const descriptor = getHealthDescriptor(metrics.compositeScore);

  const pillars = [
    { label: 'Pipeline Health', value: metrics.pipelineHealth, weight: '30%', icon: TrendingUp },
    { label: 'Renewal Health', value: metrics.renewalHealth, weight: '25%', icon: ShieldAlert },
    { label: 'Proposal Health', value: metrics.proposalHealth, weight: '20%', icon: CheckCircle2 },
    { label: 'Activity Health', value: metrics.activityHealth, weight: '15%', icon: AlertOctagon },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-slate-800/80">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Composite Score Dial */}
        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-slate-800/80"
                strokeWidth="8"
                stroke="currentColor"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className={getScoreColor(metrics.compositeScore)}
                strokeWidth="8"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * metrics.compositeScore) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold tracking-tight text-white font-display">
                {metrics.compositeScore}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Out of 100
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Composite Index
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{descriptor.label}</h3>
            <p className="text-xs text-slate-400 max-w-sm">{descriptor.note}</p>
          </div>
        </div>

        {/* Right: Sub-pillar breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          {pillars.map((p) => (
            <div
              key={p.label}
              className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between min-w-[120px]"
            >
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>{p.label}</span>
                <span className="text-[9px] font-mono text-slate-400">{p.weight}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-lg font-bold text-slate-100 font-mono">{p.value}%</span>
                <span
                  className={cn(
                    'text-[10px] font-semibold',
                    p.value >= 75 ? 'text-emerald-400' : p.value >= 50 ? 'text-amber-400' : 'text-rose-400'
                  )}
                >
                  {p.value >= 75 ? 'Healthy' : p.value >= 50 ? 'Warning' : 'Critical'}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    p.value >= 75 ? 'bg-emerald-400' : p.value >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                  )}
                  style={{ width: `${p.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
