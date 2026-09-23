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
  X,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { useAuthStore } from '@/lib/store/use-auth-store';
import { useSettingsStore } from '@/lib/store/use-settings-store';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { name: 'Executive Health', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pipeline & Rescue', href: '/opportunities', icon: KanbanSquare },
  { name: 'AI Deal Memory', href: '/deal-memory', icon: BrainCircuit, highlight: true },
  { name: 'Proposal Studio', href: '/proposals', icon: FileSignature },
  { name: 'Renewal Radar', href: '/renewals', icon: RefreshCw },
  { name: 'Activity & Cadence', href: '/activities', icon: CheckSquare },
  { name: 'Leakage Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings & Ingestion', href: '/settings', icon: Settings },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { getRevenueHealthMetrics } = useRevenueStore();
  const { user, logout } = useAuthStore();
  const { orgProfile } = useSettingsStore();
  const healthMetrics = getRevenueHealthMetrics();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-72 bg-[#090b10] border-r border-slate-800 p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="space-y-6">
          {/* Brand Header & Close */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="font-bold text-sm text-white">Revenue Rescue AI</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Org Pill */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="font-semibold text-slate-200 truncate">{orgProfile.name}</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {orgProfile.tier.replace('_', ' ')}
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.highlight && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                      AI
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-emerald-600 flex items-center justify-center text-[11px] font-bold text-white">
                AS
              </div>
              <div className="truncate">
                <div className="font-semibold text-slate-200 truncate">{user?.name || 'Executive'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.role || 'CRO'}</div>
              </div>
            </div>

            <Link
              href="/auth/login"
              onClick={() => {
                logout();
                onClose();
              }}
              className="text-slate-400 hover:text-rose-400"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
