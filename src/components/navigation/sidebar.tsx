'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  KanbanSquare,
  BrainCircuit,
  FileSignature,
  RefreshCw,
  CheckSquare,
  BarChart3,
  Settings,
  ShieldAlert,
  Zap,
  Sparkles,
} from 'lucide-react';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { useSettingsStore } from '@/lib/store/use-settings-store';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  {
    name: 'Executive Health',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: 'Live',
  },
  {
    name: 'Pipeline & Rescue',
    href: '/opportunities',
    icon: KanbanSquare,
    counterKey: 'criticalRiskCount',
  },
  {
    name: 'AI Deal Memory',
    href: '/deal-memory',
    icon: BrainCircuit,
    highlight: true,
  },
  {
    name: 'Proposal Studio',
    href: '/proposals',
    icon: FileSignature,
  },
  {
    name: 'Renewal Radar',
    href: '/renewals',
    icon: RefreshCw,
  },
  {
    name: 'Activity & Cadence',
    href: '/activities',
    icon: CheckSquare,
  },
  {
    name: 'Leakage Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings & Tiers',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { getRevenueHealthMetrics } = useRevenueStore();
  const { aiSettings, orgProfile } = useSettingsStore();
  const healthMetrics = getRevenueHealthMetrics();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#090b10] border-r border-slate-800/80 flex flex-col z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800/60">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <ShieldAlert className="h-5 w-5 text-slate-950 stroke-[2.5]" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight text-white">Revenue Rescue</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AI
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Predictive Risk OS</span>
        </div>
      </div>

      {/* Org Profile Header Pill */}
      <div className="px-3.5 py-2.5">
        <div className="px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold text-slate-200 truncate">{orgProfile.name}</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {orgProfile.tier.replace('_', ' ')}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
            {orgProfile.seatsUsed}/{orgProfile.seatsTotal} seats
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Intelligence Workspace
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                'group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <span>{item.name}</span>
              </div>

              {item.highlight && (
                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Sparkles className="h-2.5 w-2.5" />
                  Q&A
                </span>
              )}

              {item.counterKey && healthMetrics.criticalRiskCount > 0 && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {healthMetrics.criticalRiskCount} at risk
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer: Live Health Score Radial & AI Engine Status */}
      <div className="p-3.5 border-t border-slate-800/80 bg-[#07080c] space-y-2.5">
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Revenue Health
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-white">{healthMetrics.compositeScore}</span>
              <span className="text-[11px] text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="relative h-10 w-10 flex items-center justify-center">
            <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={cn(
                  healthMetrics.compositeScore > 75
                    ? 'text-emerald-400'
                    : healthMetrics.compositeScore > 50
                    ? 'text-amber-400'
                    : 'text-rose-400'
                )}
                strokeDasharray={`${healthMetrics.compositeScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Zap className="h-4 w-4 text-emerald-400 absolute" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            AI Engine:
          </span>
          <span className="font-mono text-slate-300">
            {aiSettings.provider === 'OPENAI' && aiSettings.openaiApiKey ? 'OpenAI Live' : 'Deterministic Engine'}
          </span>
        </div>
      </div>
    </aside>
  );
}
