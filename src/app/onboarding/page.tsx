'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Building,
  Sparkles,
  Database,
  UploadCloud,
  ArrowRight,
  CheckCircle2,
  Check,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/use-auth-store';
import { useSettingsStore } from '@/lib/store/use-settings-store';
import { useRevenueStore } from '@/lib/store/use-revenue-store';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuthStore();
  const { updateOrgProfile } = useSettingsStore();
  const { resetToSampleData } = useRevenueStore();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Org State
  const [orgName, setOrgName] = useState(user?.companyName || 'Enterprise Revenue Labs');
  const [industry, setIndustry] = useState('Enterprise SaaS');
  const [teamSize, setTeamSize] = useState('10-50');

  // Step 2: Ingestion State
  const [selectedSource, setSelectedSource] = useState<'DEMO_SEED' | 'CRM' | 'CSV'>('DEMO_SEED');
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
      completeOnboarding(orgName, industry, selectedSource);
      updateOrgProfile({
        name: orgName,
        tier: 'REVENUE_INTELLIGENCE',
      });
      resetToSampleData();
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07080b] flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldAlert className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-base text-white">Revenue Rescue AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Step {step} of 2</span>
            <div className="flex gap-1.5">
              <div className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-emerald-400' : 'bg-slate-800'}`} />
              <div className={`h-1.5 w-8 rounded-full ${step === 2 ? 'bg-emerald-400' : 'bg-slate-800'}`} />
            </div>
          </div>
        </div>

        {/* Step Container */}
        <div className="bg-[#0e111a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {step === 1 ? (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                  Step 1: Workspace Profile
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Configure your Organization
                </h2>
                <p className="text-xs text-slate-400">
                  Tailors risk algorithms and pipeline benchmarks to your sector.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Organization / Company Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Primary Industry
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="Enterprise SaaS">Enterprise SaaS</option>
                      <option value="Fintech">Fintech & Payments</option>
                      <option value="Healthcare">Healthcare & Bio</option>
                      <option value="Consulting">Consulting & Agency</option>
                      <option value="Insurance">Insurance & Brokers</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Revenue Team Size
                    </label>
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="1-10">1 - 10 Reps</option>
                      <option value="10-50">10 - 50 Reps</option>
                      <option value="50+">50+ Enterprise Team</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <span>Continue to Data Ingestion</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                  Step 2: Data Stream Setup
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Choose your Pipeline Data Source
                </h2>
                <p className="text-xs text-slate-400">
                  How would you like to initialize your revenue telemetry?
                </p>
              </div>

              <div className="space-y-3">
                {/* Option 1: Demo Seed */}
                <div
                  onClick={() => setSelectedSource('DEMO_SEED')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    selectedSource === 'DEMO_SEED'
                      ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">
                          Pre-Seeded B2B Pipeline Dataset
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Loads 6 active opportunities, 4 renewal accounts, deal memory threads, and proposal telemetry for instant exploration.
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedSource === 'DEMO_SEED'
                        ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                        : 'border-slate-700'
                    }`}
                  >
                    {selectedSource === 'DEMO_SEED' && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Option 2: Live CRM Connector */}
                <div
                  onClick={() => setSelectedSource('CRM')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    selectedSource === 'CRM'
                      ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">
                        Connect Salesforce or HubSpot CRM
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Bi-directional sync via OAuth 2.0 webhooks. Automatically syncs deals and stage changes.
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedSource === 'CRM'
                        ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                        : 'border-slate-700'
                    }`}
                  >
                    {selectedSource === 'CRM' && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Option 3: CSV Import */}
                <div
                  onClick={() => setSelectedSource('CSV')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    selectedSource === 'CSV'
                      ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                      <UploadCloud className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">
                        Upload Pipeline Spreadsheet (.csv)
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Import historical deal exports directly into active risk monitoring.
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedSource === 'CSV'
                        ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                        : 'border-slate-700'
                    }`}
                  >
                    {selectedSource === 'CSV' && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isFinishing}
                  className="flex-1 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Zap className="h-4 w-4" />
                  <span>{isFinishing ? 'Calibrating Revenue OS...' : 'Launch Revenue Cockpit'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
