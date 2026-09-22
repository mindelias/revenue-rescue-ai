'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck, Clock, RefreshCw, ArrowUpRight, TrendingDown } from 'lucide-react';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export function RiskSummaryCards() {
  const { getRevenueHealthMetrics, opportunities, renewals } = useRevenueStore();
  const metrics = getRevenueHealthMetrics();

  const inactiveOpps = opportunities.filter((o) => o.inactivityDays >= 7 && o.stage !== 'CLOSED_WON');
  const inactiveArr = inactiveOpps.reduce((sum, o) => sum + o.arr, 0);

  const upcomingRenewalArr = renewals
    .filter((r) => r.daysUntilRenewal <= 60 && r.status !== 'RENEWED')
    .reduce((sum, r) => sum + r.contractValue, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total ARR At Risk */}
      <div className="glass-panel glass-panel-hover rounded-xl p-5 border border-rose-500/20 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total ARR At Risk
          </span>
          <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {formatCurrency(metrics.totalArrAtRisk)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-rose-400">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>{metrics.criticalRiskCount} critical revenue bottlenecks</span>
          </div>
        </div>
        <Link
          href="/opportunities"
          className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-rose-400 transition-colors"
        >
          <span>Inspect At-Risk Deals</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Card 2: Recoverable via AI Playbooks */}
      <div className="glass-panel glass-panel-hover rounded-xl p-5 border border-emerald-500/20 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Recoverable Pipeline
          </span>
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
            {formatCurrency(metrics.totalPipelineArr * 0.78)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>78% Avg Playbook Win-Back Rate</span>
          </div>
        </div>
        <Link
          href="/opportunities"
          className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-emerald-400 transition-colors"
        >
          <span>Launch Rescue Sequences</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Card 3: Inactivity Stalled ARR */}
      <div className="glass-panel glass-panel-hover rounded-xl p-5 border border-amber-500/20 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Inactivity Stagnation
          </span>
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-amber-400 tracking-tight">
            {formatCurrency(inactiveArr)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-400/80">
            <span>{inactiveOpps.length} deals silent for &gt; 7 days</span>
          </div>
        </div>
        <Link
          href="/activities"
          className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-amber-400 transition-colors"
        >
          <span>Review Cadence Queue</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Card 4: Renewal Churn Horizon */}
      <div className="glass-panel glass-panel-hover rounded-xl p-5 border border-indigo-500/20 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Upcoming Renewals (60d)
          </span>
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <RefreshCw className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {formatCurrency(upcomingRenewalArr)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-400">
            <span>{renewals.filter((r) => r.daysUntilRenewal <= 60).length} contracts approaching expiration</span>
          </div>
        </div>
        <Link
          href="/renewals"
          className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-indigo-400 transition-colors"
        >
          <span>Open Retention Radar</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
