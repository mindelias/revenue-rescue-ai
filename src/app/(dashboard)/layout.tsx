import React, { Suspense } from 'react';
import { Sidebar } from '@/components/navigation/sidebar';
import { Topbar } from '@/components/navigation/topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#08090d] flex">
      {/* Stationed Persistent Sidebar Navigation */}
      <Sidebar />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        {/* Stationed Persistent Topbar */}
        <Topbar />

        {/* Dynamic Page Content with Suspense Boundary */}
        <main className="flex-1 pt-16 p-6 md:p-8 max-w-[1600px] w-full mx-auto">
          <Suspense
            fallback={
              <div className="h-96 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                  <span className="text-xs text-slate-400 font-mono tracking-wider">
                    CALIBRATING REVENUE INTELLIGENCE...
                  </span>
                </div>
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
