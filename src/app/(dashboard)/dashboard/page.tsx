'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, ShieldAlert, ArrowRight, Zap, RefreshCw, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { RevenueHealthGauge } from '@/components/dashboard/revenue-health-gauge';
import { RiskSummaryCards } from '@/components/dashboard/risk-summary-cards';
import { RescueActionFeed } from '@/components/dashboard/rescue-action-feed';
import { PipelineWaterfall } from '@/components/dashboard/pipeline-waterfall';
import { useRevenueStore } from '@/lib/store/use-revenue-store';

export default function DashboardPage() {
  const { opportunities, renewals, activities } = useRevenueStore();

  return (
    <div className="space-y-8 pb-12">
      {/* Executive Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-gradient-to-r from-[#0d121c] via-[#090b10] to-[#0d121c] shadow-2xl p-6 sm:p-8">
        <div className="absolute -right-10 -top-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:block opacity-40 mix-blend-screen pointer-events-none">
          <Image
            src="/assets/revenue_rescue_hero.jpg"
            alt="Revenue Rescue AI Telemetry"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Autonomous Revenue Intelligence OS • Q3 Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Predictive Revenue Rescue & Churn Defense
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Continuously analyzing deal velocity, inactivity decay, proposal engagement, and renewal health across <strong>{opportunities.length} opportunities</strong> and <strong>{renewals.length} recurring accounts</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/opportunities"
              className="h-10 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Inspect Pipeline Radar</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/deal-memory"
              className="h-10 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Zap className="h-3.5 w-3.5 text-indigo-400" />
              <span>Ask AI Deal Memory</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Revenue Health Composite Gauge */}
      <RevenueHealthGauge />

      {/* Key Metric Risk Cards */}
      <RiskSummaryCards />

      {/* Primary Action Grid: High Priority Playbooks & Stage Velocity */}
      <div className="grid grid-cols-1 gap-8">
        <RescueActionFeed />
        <PipelineWaterfall />
      </div>

      {/* Live Telemetry Activity Log Preview */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Live Revenue Telemetry Stream
              </h3>
              <p className="text-xs text-slate-400">
                Real-time risk score recalibrations, activity logs, and automated triggers
              </p>
            </div>
          </div>
          <Link
            href="/activities"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            View All Activities <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="divide-y divide-slate-800/60">
          {activities.slice(0, 4).map((act) => (
            <div key={act.id} className="py-3 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{act.title}</span>
                  {act.isAutomated && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                      AI Auto
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{act.description}</p>
                {act.impactSummary && (
                  <span className="text-[11px] text-emerald-400 font-medium">
                    ⚡ {act.impactSummary}
                  </span>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-slate-400 block">{act.performedAt}</span>
                <span className="text-[11px] text-slate-400 font-medium">{act.performedBy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
