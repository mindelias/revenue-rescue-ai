'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { useAuthStore } from '@/lib/store/use-auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('aminat@acuitylabs.io');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email);
      router.push('/dashboard');
    }, 400);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('cro@enterprise.com', 'Enterprise CRO');
      router.push('/dashboard');
    }, 300);
  };

  return (
    <div className="bg-[#0e111a] border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-2xl space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-white tracking-tight">Sign in to your Workspace</h2>
        <p className="text-xs text-slate-400">
          Enter your executive credentials to access live revenue telemetry.
        </p>
      </div>

      {/* 1-Click Demo Shortcut */}
      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={isLoading}
        className="w-full h-11 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
      >
        <Sparkles className="h-4 w-4" />
        <span>1-Click Executive Demo Access</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-800 w-full" />
        <span className="bg-[#0e111a] px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 shrink-0">
          or sign in with email
        </span>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Work Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <span className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer">
              Forgot password?
            </span>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
        >
          <span>{isLoading ? 'Signing In...' : 'Sign In with Email'}</span>
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-400">
        Don&apos;t have an organization account?{' '}
        <Link href="/auth/register" className="text-emerald-400 hover:text-emerald-300 font-semibold">
          Create account
        </Link>
      </div>
    </div>
  );
}
