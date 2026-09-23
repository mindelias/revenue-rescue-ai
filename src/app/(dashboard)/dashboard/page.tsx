'use client';

import React from 'react';
import { Sparkles, ArrowRight, Zap, ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { RevenueHealthGauge } from '@/components/dashboard/revenue-health-gauge';
import { RescueActionFeed } from '@/components/dashboard/rescue-action-feed';
import { PipelineWaterfall } from '@/components/dashboard/pipeline-waterfall';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { opportunities, renewals, getRevenueHealthMetrics } = useRevenueStore();
  const metrics = getRevenueHealthMetrics();

  return (
    <div className="space-y-6 pb-12">
      {/* Calm Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Revenue Command & Risk Intelligence
            </h1>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Q3 Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitoring <strong>{opportunities.length} active opportunities</strong> (${(metrics.totalPipelineArr / 1000000).toFixed(1)}M Pipeline) and <strong>{renewals.length} recurring accounts</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/opportunities"
            className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <span>Pipeline Radar</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/deal-memory"
            className="h-9 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI Deal Memory</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid: 3 Clear Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Pipeline Value
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
            {formatCurrency(metrics.totalPipelineArr)}
          </div>
          <span className="text-[11px] text-slate-400 block">Across 6 active stages</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-rose-500/25 space-y-1 bg-rose-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block">
              ARR At Risk (Leakage)
            </span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-400 tracking-tight">
            {formatCurrency(metrics.totalArrAtRisk)}
          </div>
          <span className="text-[11px] text-rose-400/80 block">
            {metrics.criticalRiskCount} critical deals require intervention
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/25 space-y-1 bg-emerald-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block">
              Recoverable via AI Playbooks
            </span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tracking-tight">
            {formatCurrency(metrics.totalPipelineArr * 0.78)}
          </div>
          <span className="text-[11px] text-emerald-400/80 block">
            78% average historical win-back rate
          </span>
        </div>
      </div>

      {/* Revenue Health Composite Gauge */}
      <RevenueHealthGauge />

      {/* High-Impact Playbooks */}
      <RescueActionFeed />

      {/* Pipeline Waterfall */}
      <PipelineWaterfall />
    </div>
  );
}
