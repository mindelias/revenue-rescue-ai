'use client';

import React from 'react';
import { Layers, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { DealStage } from '@/types/opportunity';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

const STAGES: Array<{ id: DealStage; label: string; benchmarkDays: number }> = [
  { id: 'DISCOVERY', label: 'Discovery', benchmarkDays: 14 },
  { id: 'SOLUTION_MAPPING', label: 'Solution Mapping', benchmarkDays: 12 },
  { id: 'PROPOSAL_OUT', label: 'Proposal Out', benchmarkDays: 7 },
  { id: 'EXECUTIVE_REVIEW', label: 'Exec Review', benchmarkDays: 10 },
  { id: 'LEGAL_SECURITY', label: 'Legal & Security', benchmarkDays: 14 },
  { id: 'CLOSED_WON', label: 'Closed Won', benchmarkDays: 0 },
];

export function PipelineWaterfall() {
  const { opportunities } = useRevenueStore();

  const stageData = STAGES.map((stage) => {
    const dealsInStage = opportunities.filter((o) => o.stage === stage.id);
    const totalArr = dealsInStage.reduce((sum, o) => sum + o.arr, 0);
    const criticalCount = dealsInStage.filter((o) => o.riskLevel === 'CRITICAL' || o.riskLevel === 'HIGH').length;
    const avgDays = dealsInStage.length
      ? Math.round(dealsInStage.reduce((sum, o) => sum + o.daysInStage, 0) / dealsInStage.length)
      : 0;

    return {
      ...stage,
      count: dealsInStage.length,
      totalArr,
      criticalCount,
      avgDays,
      isStalled: stage.id !== 'CLOSED_WON' && avgDays > stage.benchmarkDays,
    };
  });

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Pipeline Velocity & Leakage Stages
            </h3>
            <p className="text-xs text-slate-400">
              Stage velocity tracking against benchmark closure timelines
            </p>
          </div>
        </div>
        <Link
          href="/opportunities"
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          View Kanban Board <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Stage Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stageData.map((s) => (
          <div
            key={s.id}
            className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
              s.id === 'CLOSED_WON'
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : s.isStalled
                ? 'bg-rose-950/20 border-rose-500/30'
                : 'bg-slate-900/70 border-slate-800/80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span className="truncate">{s.label}</span>
                <span className="font-mono text-slate-300">{s.count}</span>
              </div>
              <div className="mt-2 text-base font-bold font-mono text-white">
                {formatCurrency(s.totalArr)}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/60 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Avg Stage Age:</span>
                <span
                  className={`font-mono font-bold ${
                    s.isStalled ? 'text-rose-400' : 'text-slate-300'
                  }`}
                >
                  {s.avgDays}d {s.benchmarkDays > 0 && `(tgt: ${s.benchmarkDays}d)`}
                </span>
              </div>

              {s.criticalCount > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-rose-400 font-semibold">
                  <AlertCircle className="h-3 w-3" />
                  <span>{s.criticalCount} at risk</span>
                </div>
              )}

              {s.id === 'CLOSED_WON' && (
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Secured ARR</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
