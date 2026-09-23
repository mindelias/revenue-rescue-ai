import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Sparkles, CheckCircle2, TrendingUp, ShieldCheck, Lock } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07080b] flex flex-col justify-center text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[90vh]">
        {/* Left Side: Brand Narrative & Value Proposition */}
        <div className="lg:col-span-6 space-y-6 lg:pr-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldAlert className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">Revenue Rescue</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AI
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Predictive Revenue Intelligence OS</span>
            </div>
          </Link>

          <div className="space-y-3 pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Stop Silent Pipeline Leakage</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-display">
              The Operating System for Modern Revenue Teams.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Predict deal risk before it's too late. Eliminate pipeline stalling with semantic deal memory, automated follow-up cadences, and 1-click rescue playbooks.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span><strong>Composite Revenue Health Score:</strong> Instant 0–100 pipeline visibility</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span><strong>AI Deal Memory:</strong> Query emails and call transcripts in plain English</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span><strong>Autonomous Churn Defense:</strong> 30/60/90-day retention radar</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
