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
} from 'lucide-react';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { Opportunity, DealStage, RiskLevel } from '@/types/opportunity';
import { DealDrawer } from '@/components/opportunities/deal-drawer';
import { formatCurrency, getRiskBadgeClasses } from '@/lib/utils';

const STAGES: Array<{ id: DealStage; label: string }> = [
  { id: 'DISCOVERY', label: 'Discovery' },
  { id: 'SOLUTION_MAPPING', label: 'Solution Mapping' },
  { id: 'PROPOSAL_OUT', label: 'Proposal Out' },
  { id: 'EXECUTIVE_REVIEW', label: 'Executive Review' },
  { id: 'LEGAL_SECURITY', label: 'Legal & Security' },
  { id: 'CLOSED_WON', label: 'Closed Won' },
];

export default function OpportunitiesPage() {
  const { opportunities, addOpportunity, updateOpportunityStage } = useRevenueStore();
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
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
              Pipeline & Revenue Risk Radar
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filteredOpps.length} Active Deals
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time deal progression velocity, inactivity decay warnings, and 1-click rescue playbooks.
          </p>
        </div>

        {/* View Toggle & Actions */}
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'KANBAN'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KanbanSquare className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'TABLE'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Grid Table</span>
            </button>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Opportunity</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by company, deal title or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Risk:
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'HEALTHY'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedRiskFilter(level)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                selectedRiskFilter === level
                  ? 'bg-slate-700 text-white border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* View: KANBAN BOARD */}
      {viewMode === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
          {STAGES.map((stage) => {
            const dealsInStage = filteredOpps.filter((o) => o.stage === stage.id);
            const stageArr = dealsInStage.reduce((sum, o) => sum + o.arr, 0);

            return (
              <div
                key={stage.id}
                className="bg-[#090b10]/80 rounded-2xl border border-slate-800/80 p-3 space-y-3 min-h-[500px] flex flex-col"
              >
                {/* Column Header */}
                <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">{stage.label}</h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      {formatCurrency(stageArr)}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {dealsInStage.length}
                  </span>
                </div>

                {/* Deal Cards */}
                <div className="space-y-3 flex-1">
                  {dealsInStage.map((deal) => {
                    const badge = getRiskBadgeClasses(deal.riskLevel);
                    return (
                      <div
                        key={deal.id}
                        onClick={() => setInspectingOpp(deal)}
                        className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer shadow-lg space-y-2.5 group relative hover:translate-y-[-2px]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                            {deal.company}
                          </span>
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            {deal.riskLevel}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {deal.title}
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                          <span className="font-mono font-bold text-slate-200">
                            {formatCurrency(deal.arr)}
                          </span>
                          <span
                            className={`font-mono flex items-center gap-1 ${
                              deal.inactivityDays >= 7 ? 'text-rose-400 font-bold' : 'text-slate-400'
                            }`}
                          >
                            <Clock className="h-3 w-3" />
                            {deal.inactivityDays}d silent
                          </span>
                        </div>

                        {deal.recommendedPlaybooks.length > 0 && (
                          <div className="pt-1 flex items-center justify-between text-[10px] text-emerald-400 font-semibold">
                            <span className="flex items-center gap-1">
                              <Sparkles className="h-3 w-3" /> Playbook Ready
                            </span>
                            <ArrowRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {dealsInStage.length === 0 && (
                    <div className="h-32 flex items-center justify-center border border-dashed border-slate-800/60 rounded-xl text-[11px] text-slate-400">
                      No deals in stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View: GRID TABLE */}
      {viewMode === 'TABLE' && (
        <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090b10] border-b border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Company & Deal</th>
                <th className="p-4">ARR Value</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Risk Telemetry</th>
                <th className="p-4">Inactivity</th>
                <th className="p-4">Owner</th>
                <th className="p-4 text-right">Actions</th>
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
                      <div className="font-bold text-white">{deal.company}</div>
                      <div className="text-slate-400 text-[11px]">{deal.title}</div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-200">
                      {formatCurrency(deal.arr)}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
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
                    <td className="p-4 font-mono text-slate-400">
                      <span className={deal.inactivityDays >= 7 ? 'text-rose-400 font-bold' : ''}>
                        {deal.inactivityDays} days
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{deal.ownerName}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectingOpp(deal);
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
