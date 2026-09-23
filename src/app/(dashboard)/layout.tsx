import React, { Suspense } from 'react';
import { Sidebar } from '@/components/navigation/sidebar';
import { Topbar } from '@/components/navigation/topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07080b] flex text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Desktop Stationed Persistent Sidebar (hidden on mobile) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col pl-0 lg:pl-64 min-w-0 w-full overflow-x-hidden">
        {/* Topbar with Mobile Hamburger Drawer */}
        <Topbar />

        {/* Dynamic Page Content with Generous Topbar Clearance */}
        <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] w-full mx-auto">
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
