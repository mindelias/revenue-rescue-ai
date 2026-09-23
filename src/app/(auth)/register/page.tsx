'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Building, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/lib/store/use-auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !companyName) return;

    setIsLoading(true);
    setTimeout(() => {
      register(name, email, companyName);
      router.push('/onboarding');
    }, 400);
  };

  return (
    <div className="bg-[#0e111a] border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-2xl space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-white tracking-tight">Create Organization Workspace</h2>
        <p className="text-xs text-slate-400">
          Set up your team's revenue intelligence operating system.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-3.5">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Organization</label>
          <div className="relative">
            <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              placeholder="e.g. Acme Software Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Work Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              placeholder="alex@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 mt-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <span>{isLoading ? 'Setting up Workspace...' : 'Continue to Onboarding'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
