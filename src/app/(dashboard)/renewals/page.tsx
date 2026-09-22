'use client';

import React, { useState } from 'react';
import {
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserCheck,
  ArrowRight,
  LifeBuoy,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { RenewalAccount } from '@/types/renewal';
import { formatCurrency, getRiskBadgeClasses } from '@/lib/utils';

export default function RenewalsPage() {
  const { renewals, executeRenewalRescue } = useRevenueStore();
  const [selectedHorizon, setSelectedHorizon] = useState<'ALL' | '30' | '60' | '90'>('ALL');
  const [activeAccount, setActiveAccount] = useState<RenewalAccount | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  const filteredRenewals = renewals.filter((r) => {
    if (selectedHorizon === '30') return r.daysUntilRenewal <= 30;
    if (selectedHorizon === '60') return r.daysUntilRenewal <= 60;
    if (selectedHorizon === '90') return r.daysUntilRenewal <= 90;
    return true;
  });

  const handleRescue = (account: RenewalAccount) => {
    executeRenewalRescue(account.id, account.rescueActionRecommended);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b'],
      });
    } catch {}
    setToastMsg(`Dispatched Churn Defense Playbook for ${account.accountName}! Churn risk dropped.`);
    setTimeout(() => setToastMsg(''), 5000);
  };

  const totalRenewalARR = renewals.reduce((sum, r) => sum + r.contractValue, 0);
  const atRiskRenewalARR = renewals
    .filter((r) => r.churnProbability >= 50 && r.status !== 'RENEWED')
    .reduce((sum, r) => sum + r.contractValue, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
              Renewals & Churn Defense Radar
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {renewals.length} Accounts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Proactively protect recurring revenue with usage decay monitoring, ticket friction alerts, and executive retention playbooks.
          </p>
        </div>

        {/* Horizon Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Horizon:
          </span>
          {(['ALL', '30', '60', '90'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHorizon(h)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedHorizon === h
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {h === 'ALL' ? 'All' : `< ${h}d`}
            </button>
          ))}
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            Total Recurring Base
          </span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {formatCurrency(totalRenewalARR)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/20">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            Renewal ARR At Risk
          </span>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {formatCurrency(atRiskRenewalARR)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/20">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            Avg Account Health Score
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {Math.round(renewals.reduce((sum, r) => sum + r.healthScore, 0) / renewals.length)} / 100
          </div>
        </div>
      </div>

      {/* Renewal Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRenewals.map((account) => {
          const badge = getRiskBadgeClasses(account.churnRisk);
          const isAtRisk = account.churnProbability >= 50;

          return (
            <div
              key={account.id}
              className={`p-5 rounded-2xl border transition-all space-y-4 shadow-xl ${
                isAtRisk
                  ? 'bg-slate-900/90 border-rose-500/30 hover:border-rose-500/50'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">{account.accountName}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {account.currentTier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Account Manager: {account.accountManager} • Contact: {account.primaryContact.name} ({account.primaryContact.role})
                  </p>
                </div>

                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}
                >
                  {account.churnRisk} CHURN RISK ({account.churnProbability}%)
                </span>
              </div>

              {/* Stats Bar */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-4 gap-2 text-center text-[10px]">
                <div>
                  <span className="text-slate-400 block">Value</span>
                  <span className="font-mono font-bold text-slate-200 text-xs">
                    {formatCurrency(account.contractValue)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Renews In</span>
                  <span
                    className={`font-mono font-bold text-xs ${
                      account.daysUntilRenewal <= 30 ? 'text-rose-400' : 'text-slate-200'
                    }`}
                  >
                    {account.daysUntilRenewal} days
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Usage Trend</span>
                  <span
                    className={`font-semibold text-[11px] ${
                      account.usageTrend.includes('DECLINING') ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {account.usageTrend.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Open Tickets</span>
                  <span
                    className={`font-mono font-bold text-xs ${
                      account.unresolvedTicketsCount > 0 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {account.unresolvedTicketsCount} P2s
                  </span>
                </div>
              </div>

              {/* Churn Risk Drivers */}
              {account.churnRiskDrivers.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Churn Risk Drivers
                  </span>
                  <div className="space-y-1">
                    {account.churnRiskDrivers.map((driver, dIdx) => (
                      <div
                        key={dIdx}
                        className="text-xs text-rose-300/90 flex items-start gap-1.5"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{driver}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Recommendation */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Recommended Churn Defense
                  </span>
                  <p className="text-xs text-slate-300 font-medium">
                    {account.rescueActionRecommended}
                  </p>
                </div>

                {account.status === 'RESCUE_IN_PROGRESS' ? (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shrink-0">
                    Rescue Active
                  </span>
                ) : (
                  <button
                    onClick={() => handleRescue(account)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-all cursor-pointer"
                  >
                    <span>Dispatch Playbook</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
