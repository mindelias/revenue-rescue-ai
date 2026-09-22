'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Zap,
  Target,
  Award,
} from 'lucide-react';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { formatCurrency } from '@/lib/utils';

export default function AnalyticsPage() {
  const { getRevenueHealthMetrics, opportunities } = useRevenueStore();
  const metrics = getRevenueHealthMetrics();

  const leakageCauses = [
    { cause: 'Inactivity & Champion Silence', pct: 38, impactArr: 240000, color: 'bg-rose-500' },
    { cause: 'Procurement & Pricing Pushback', pct: 26, impactArr: 185000, color: 'bg-amber-500' },
    { cause: 'Legal Redlines & BAA Indemnity', pct: 20, impactArr: 320000, color: 'bg-indigo-500' },
    { cause: 'Competitive Alternative Bake-off', pct: 16, impactArr: 95000, color: 'bg-purple-500' },
  ];

  const playbookPerformance = [
    { playbook: 'Value-Preserving Multi-Year Rebundle', winRate: 88, recoveredArr: 370000, color: 'text-emerald-400' },
    { playbook: 'Counsel-to-Counsel Legal Bridge', winRate: 82, recoveredArr: 420000, color: 'text-emerald-400' },
    { playbook: 'Executive Sponsor Multi-Threading', winRate: 78, recoveredArr: 580000, color: 'text-emerald-400' },
    { playbook: 'Competitive Differentiation Spec Kit', winRate: 74, recoveredArr: 190000, color: 'text-emerald-400' },
  ];

  const reps = [
    { name: 'Sarah Jenkins', pipeline: 390000, rescued: 240000, winBackRate: '86%', rating: 'Elite' },
    { name: 'Marcus Chen', pipeline: 280000, rescued: 185000, winBackRate: '82%', rating: 'High' },
    { name: 'Chloe Dupont', pipeline: 530000, rescued: 320000, winBackRate: '79%', rating: 'High' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
            Executive Revenue Leakage & Recovery Analytics
          </h1>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Q3 Telemetry
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Root cause leakage attribution, playbook win-back telemetry, and team de-risking velocity.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-5 border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Pipeline Examined
          </span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {formatCurrency(metrics.totalPipelineArr)}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-rose-500/20">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Identified Leakage Risk
          </span>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {formatCurrency(metrics.totalArrAtRisk)}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-emerald-500/20">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Avg Playbook Recovery Rate
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            80.5%
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-indigo-500/20">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pipeline Health Composite
          </span>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
            {metrics.compositeScore} / 100
          </div>
        </div>
      </div>

      {/* Two Column Grid: Leakage Causes & Playbook Win Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leakage Root Causes */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">Revenue Leakage Root Causes</h3>
          </div>
          <p className="text-xs text-slate-400">
            Primary bottlenecks causing deal velocity slowdown across pipeline stages
          </p>

          <div className="space-y-4 pt-2">
            {leakageCauses.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.cause}</span>
                  <span className="font-mono text-slate-300 font-bold">{item.pct}% ({formatCurrency(item.impactArr)})</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Playbook Win-Back Telemetry */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Rescue Playbook Win-Back Rates</h3>
          </div>
          <p className="text-xs text-slate-400">
            Empirical success rate and recovered revenue across AI playbooks
          </p>

          <div className="divide-y divide-slate-800/60 pt-1">
            {playbookPerformance.map((pb, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">{pb.playbook}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Recovered ARR: <strong className="text-white font-mono">{formatCurrency(pb.recoveredArr)}</strong>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/25">
                  {pb.winRate}% Win
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Executive De-risking Leaderboard */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Executive De-risking Velocity Leaderboard</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090b10] text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Account Executive</th>
                <th className="p-3.5">Managed Pipeline</th>
                <th className="p-3.5">Rescued / Defended ARR</th>
                <th className="p-3.5">Recovery Win-Rate</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reps.map((rep, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="p-3.5 font-bold text-white">{rep.name}</td>
                  <td className="p-3.5 font-mono text-slate-300">{formatCurrency(rep.pipeline)}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-400">
                    {formatCurrency(rep.rescued)}
                  </td>
                  <td className="p-3.5 font-mono text-slate-200">{rep.winBackRate}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                      {rep.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
