'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  X,
  Menu,
  LogOut,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { useAuthStore } from '@/lib/store/use-auth-store';
import { useSettingsStore } from '@/lib/store/use-settings-store';
import { formatCurrency } from '@/lib/utils';
import { MobileNav } from './mobile-nav';

export function Topbar() {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditCompleteMsg, setAuditCompleteMsg] = useState('');

  const { opportunities, renewals, resetToSampleData, getRevenueHealthMetrics, addActivity } = useRevenueStore();
  const { user, logout } = useAuthStore();
  const { orgProfile } = useSettingsStore();
  const metrics = getRevenueHealthMetrics();

  const criticalOpps = opportunities.filter((o) => o.riskLevel === 'CRITICAL' && o.stage !== 'CLOSED_WON');
  const criticalRenewals = renewals.filter((r) => r.churnRisk === 'CRITICAL');

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditCompleteMsg(`Audited ${opportunities.length} deals. Flagged ${metrics.criticalRiskCount} critical bottlenecks.`);
      addActivity({
        type: 'NOTE',
        title: 'Full Revenue Risk Telemetry Audit Completed',
        description: `Autonomous scan evaluated 6 pipeline stages and calibrated risk metrics.`,
        performedBy: 'Revenue Rescue AI',
        sentiment: 'POSITIVE',
        impactSummary: 'Telemetry calibrated across all active deal vectors',
        isAutomated: true,
      });
      setTimeout(() => setAuditCompleteMsg(''), 5000);
    }, 900);
  };

  return (
    <>
      <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-[#090b10]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-20">
        {/* Left: Mobile Hamburger & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={() => setShowMobileNav(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative w-full hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search opportunities, accounts, or ask deal memory..."
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Right: Actions, Risk Audit, Notifications, User */}
        <div className="flex items-center gap-2.5">
          {auditCompleteMsg && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{auditCompleteMsg}</span>
            </div>
          )}

          {/* AI Risk Audit Button */}
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="h-8.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isAuditing ? 'Scanning...' : 'Run Risk Audit'}</span>
          </button>

          {/* Reset Demo Seed */}
          <button
            onClick={resetToSampleData}
            title="Reset dataset to sample baseline"
            className="h-8.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Reset Seed</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative h-8.5 w-8.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              {(criticalOpps.length > 0 || criticalRenewals.length > 0) && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center border-2 border-[#090b10]">
                  {criticalOpps.length + criticalRenewals.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                    <span className="text-xs font-bold text-white">Active Risk Alerts</span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="py-2 divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
                  {criticalOpps.map((opp) => (
                    <div key={opp.id} className="py-2.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-rose-400 truncate">{opp.company}</span>
                        <span className="font-mono text-slate-400">{formatCurrency(opp.arr)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{opp.summary}</p>
                      <Link
                        href="/opportunities"
                        onClick={() => setShowNotifications(false)}
                        className="mt-1.5 text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
                      >
                        Execute Rescue <ArrowUpRight className="h-2.5 w-2.5" />
                      </Link>
                    </div>
                  ))}

                  {criticalRenewals.map((ren) => (
                    <div key={ren.id} className="py-2.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-amber-400 truncate">{ren.accountName}</span>
                        <span className="font-mono text-slate-400">{formatCurrency(ren.contractValue)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Renews in {ren.daysUntilRenewal}d ({ren.churnProbability}% churn risk)
                      </p>
                      <Link
                        href="/renewals"
                        onClick={() => setShowNotifications(false)}
                        className="mt-1.5 text-[10px] font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                      >
                        Retention Radar <ArrowUpRight className="h-2.5 w-2.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              AS
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="text-xs font-semibold text-slate-200">{user?.name || 'Aminat S.'}</span>
              <span className="text-[10px] text-slate-400">{user?.role || 'CRO'}</span>
            </div>
            <Link
              href="/auth/login"
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors ml-1"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNav isOpen={showMobileNav} onClose={() => setShowMobileNav(false)} />
    </>
  );
}
