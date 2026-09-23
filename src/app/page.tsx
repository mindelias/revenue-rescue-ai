'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/use-auth-store';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isOnboarded } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    } else if (!isOnboarded) {
      router.replace('/onboarding');
    } else {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isOnboarded, router]);

  return (
    <div className="min-h-screen bg-[#07080b] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <span className="text-xs text-slate-400 font-mono tracking-wider">
          LOADING REVENUE RESCUE AI...
        </span>
      </div>
    </div>
  );
}
