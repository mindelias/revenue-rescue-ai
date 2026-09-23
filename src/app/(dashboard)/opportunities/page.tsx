'use client';

import React, { useState } from 'react';
import {
  KanbanSquare,
  Table as TableIcon,
  Plus,
  Filter,
  ShieldAlert,
  Clock,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Search,
  CheckCircle2,
  Building,
  ChevronRight,
} from 'lucide-react';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { Opportunity, DealStage, RiskLevel } from '@/types/opportunity';
import { DealDrawer } from '@/components/opportunities/deal-drawer';
import { formatCurrency, getRiskBadgeClasses } from '@/lib/utils';

const STAGES: Array<{ id: DealStage; label: string; description: string }> = [
  { id: 'DISCOVERY', label: 'Discovery', description: 'Initial qualification & pain audit' },
  { id: 'SOLUTION_MAPPING', label: 'Solution Mapping', description: 'Technical scoping & champion buy-in' },
  { id: 'PROPOSAL_OUT', label: 'Proposal Out', description: 'Commercial terms & scope delivered' },
  { id: 'EXECUTIVE_REVIEW', label: 'Executive Review', description: 'CFO / VP approval & budget check' },
  { id: 'LEGAL_SECURITY', label: 'Legal & Security', description: 'SOC2, BAA, & contract redlines' },
  { id: 'CLOSED_WON', label: 'Closed Won', description: 'Executed agreements & onboarding' },
];

export default function OpportunitiesPage() {
  const { opportunities, addOpportunity } = useRevenueStore();
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('KANBAN');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingOpp, setInspectingOpp] = useState<Opportunity | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // New Deal Form State
  const [newCompany, setNewCompany] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newArr, setNewArr] = useState(120000);
  const [newStage, setNewStage] = useState<DealStage>('DISCOVERY');

  const filteredOpps = opportunities.filter((opp) => {
    const matchesRisk = selectedRiskFilter === 'ALL' || opp.riskLevel === selectedRiskFilter;
    const matchesSearch =
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.industry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const totalFilteredArr = filteredOpps.reduce((sum, o) => sum + o.arr, 0);

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newTitle) return;

    const newDeal: Opportunity = {
      id: `opp-${Date.now()}`,
      company: newCompany,
      title: newTitle,
      industry: 'Enterprise SaaS',
      arr: Number(newArr),
      stage: newStage,
      ownerName: 'Aminat S.',
      ownerAvatar: 'AS',
      riskScore: 25,
      riskLevel: 'LOW',
      healthScore: 85,
      daysInStage: 1,
      inactivityDays: 0,
      expectedCloseDate: '2026-11-30',
      lastActivityDate: new Date().toISOString().split('T')[0],
      summary: 'Newly created opportunity in active discovery pipeline.',
      dealMemorySnippet: 'Initial discovery scheduled with executive buyer.',
      stakeholders: [],
      riskFactors: [],
      recommendedPlaybooks: [],
    };

    addOpportunity(newDeal);
    setShowNewModal(false);
    setNewCompany('');
    setNewTitle('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Primary Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Pipeline & Revenue Risk Radar
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              {filteredOpps.length} Deals • {formatCurrency(totalFilteredArr)} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time deal progression velocity, inactivity decay warnings, and 1-click rescue playbooks.
          </p>
        </div>

        {/* View Mode Toggle & Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'KANBAN'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KanbanSquare className="h-3.5 w-3.5" />
              <span>Kanban Board</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'TABLE'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Grid Table</span>
            </button>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Opportunity</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-3.5 rounded-2xl bg-[#0e111a] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company, deal title or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Risk Level:
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'HEALTHY'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedRiskFilter(level)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                selectedRiskFilter === level
                  ? 'bg-slate-700 text-white border border-slate-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* View 1: HORIZONTALLY SCROLLABLE SPACIOUS KANBAN BOARD */}
      {viewMode === 'KANBAN' && (
        <div className="space-y-2">
          {/* Subtle scroll hint on desktop */}
          <div className="hidden xl:flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Showing all 6 Pipeline Stages</span>
            <span className="font-mono">← Scroll horizontally to view all stages →</span>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-thin pt-1 items-start">
            {STAGES.map((stage) => {
              const dealsInStage = filteredOpps.filter((o) => o.stage === stage.id);
              const stageArr = dealsInStage.reduce((sum, o) => sum + o.arr, 0);

              return (
                <div
                  key={stage.id}
                  className="w-[320px] min-w-[320px] shrink-0 bg-[#0e111a] rounded-2xl border border-slate-800/90 p-4 space-y-3.5 flex flex-col shadow-xl"
                >
                  {/* Column Header */}
                  <div className="pb-3 border-b border-slate-800/80 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white tracking-tight">{stage.label}</h3>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {dealsInStage.length}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-bold text-emerald-400 mt-1">
                        {formatCurrency(stageArr)}
                      </div>
                    </div>
                  </div>

                  {/* Deal Cards */}
                  <div className="space-y-3 min-h-[400px]">
                    {dealsInStage.map((deal) => {
                      const badge = getRiskBadgeClasses(deal.riskLevel);
                      const isSilent = deal.inactivityDays >= 7;

                      return (
                        <div
                          key={deal.id}
                          onClick={() => setInspectingOpp(deal)}
                          className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-md space-y-3 group hover:translate-y-[-2px] hover:bg-slate-900"
                        >
                          {/* Card Header: Company & Risk Badge */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <span className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors block">
                                {deal.company}
                              </span>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                                <Building className="h-3 w-3 text-slate-400" />
                                {deal.industry}
                              </span>
                            </div>

                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}
                            >
                              {deal.riskLevel} ({deal.riskScore}%)
                            </span>
                          </div>

                          {/* Deal Title */}
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                            {deal.title}
                          </p>

                          {/* Metrics Strip */}
                          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                            <div>
                              <span className="text-[10px] text-slate-400 block">ARR Value</span>
                              <span className="font-bold text-white text-xs">
                                {formatCurrency(deal.arr)}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block">Inactivity</span>
                              <span
                                className={`font-bold text-xs flex items-center justify-end gap-1 ${
                                  isSilent ? 'text-rose-400' : 'text-slate-300'
                                }`}
                              >
                                <Clock className="h-3 w-3" />
                                {deal.inactivityDays}d silent
                              </span>
                            </div>
                          </div>

                          {/* Card Footer: Playbook Alert / Owner */}
                          <div className="pt-1 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-400">
                              Owner: <strong className="text-slate-300">{deal.ownerName}</strong>
                            </span>

                            {deal.recommendedPlaybooks.length > 0 && (
                              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 group-hover:underline">
                                <Sparkles className="h-3 w-3" /> Playbook Ready <ChevronRight className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {dealsInStage.length === 0 && (
                      <div className="h-36 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
                        <span>No deals in this stage</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: DENSE DATA GRID TABLE */}
      {viewMode === 'TABLE' && (
        <div className="bg-[#0e111a] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090b10] border-b border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Company & Industry</th>
                  <th className="p-4">Deal Title</th>
                  <th className="p-4">ARR Value</th>
                  <th className="p-4">Pipeline Stage</th>
                  <th className="p-4">Risk Telemetry</th>
                  <th className="p-4">Silence Duration</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOpps.map((deal) => {
                  const badge = getRiskBadgeClasses(deal.riskLevel);
                  return (
                    <tr
                      key={deal.id}
                      className="hover:bg-slate-900/60 transition-colors cursor-pointer"
                      onClick={() => setInspectingOpp(deal)}
                    >
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{deal.company}</div>
                        <div className="text-slate-400 text-[11px]">{deal.industry}</div>
                      </td>
                      <td className="p-4 text-slate-300 max-w-xs truncate">{deal.title}</td>
                      <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                        {formatCurrency(deal.arr)}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-medium text-xs">
                          {deal.stage.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {deal.riskLevel} ({deal.riskScore}%)
                        </span>
                      </td>
                      <td className="p-4 font-mono">
                        <span className={deal.inactivityDays >= 7 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {deal.inactivityDays} days silent
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{deal.ownerName}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingOpp(deal);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                        >
                          Inspect Deal
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deal Detail Drawer */}
      <DealDrawer opportunity={inspectingOpp} onClose={() => setInspectingOpp(null)} />

      {/* Add Deal Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <form
            onSubmit={handleCreateDeal}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add New Opportunity</h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise AI Telemetry Platform Rollout"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Target ARR ($)</label>
                  <input
                    type="number"
                    required
                    value={newArr}
                    onChange={(e) => setNewArr(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Initial Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as DealStage)}
                    className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Create Deal</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
