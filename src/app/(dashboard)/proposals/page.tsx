'use client';

import React, { useState } from 'react';
import {
  FileSignature,
  Sparkles,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  ExternalLink,
  Edit3,
  Save,
  Download,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { useSettingsStore } from '@/lib/store/use-settings-store';
import { Proposal, ProposalSection } from '@/types/proposal';
import { formatCurrency } from '@/lib/utils';

export default function ProposalsPage() {
  const { proposals, opportunities, addProposal, updateProposalSection } = useRevenueStore();
  const { aiSettings } = useSettingsStore();

  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(proposals[0] || null);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Proposal Builder State
  const [selectedOppId, setSelectedOppId] = useState(opportunities[0]?.id || '');
  const [templateType, setTemplateType] = useState('ENTERPRISE_SaaS');
  const [proposalTitle, setProposalTitle] = useState('');
  const [generatedSections, setGeneratedSections] = useState<ProposalSection[]>([]);
  const [previewProposal, setPreviewProposal] = useState<Proposal | null>(null);

  const handleOpenBuilder = () => {
    const opp = opportunities.find((o) => o.id === selectedOppId) || opportunities[0];
    setProposalTitle(`Enterprise Partnership & Service Agreement — ${opp?.company || 'Client'}`);
    setShowBuilderModal(true);
    handleGenerateDraft(opp);
  };

  const handleGenerateDraft = async (opp = opportunities.find((o) => o.id === selectedOppId)) => {
    if (!opp) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deal: opp,
          templateType,
          apiKey: aiSettings.openaiApiKey,
        }),
      });

      const json = await res.json();
      if (json.success && json.sections) {
        setGeneratedSections(json.sections);
      }
    } catch (err) {
      console.error('Failed to generate proposal:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveNewProposal = () => {
    const opp = opportunities.find((o) => o.id === selectedOppId) || opportunities[0];
    if (!opp) return;

    const newProp: Proposal = {
      id: `prop-${Date.now()}`,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      clientCompany: opp.company,
      title: proposalTitle,
      version: 'v1.0-AI',
      totalValue: opp.arr,
      status: 'AI_GENERATED',
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      templateType: templateType as Proposal['templateType'],
      engagement: {
        totalViews: 0,
        avgTimeSpentMinutes: 0,
        mostViewedSection: 'Executive Summary',
        pricingViewedCount: 0,
      },
      sections: generatedSections,
    };

    addProposal(newProp);
    setSelectedProposal(newProp);
    setShowBuilderModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
              AI Proposal Studio & Engagement Intelligence
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {proposals.length} Proposals
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Auto-generate tailored enterprise proposals and track real-time recipient section engagement.
          </p>
        </div>

        <button
          onClick={handleOpenBuilder}
          className="h-10 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>New AI Proposal</span>
        </button>
      </div>

      {/* Main Grid: Proposal List & Live Document Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Proposals List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Active Proposals & Telemetry
          </div>

          {proposals.map((prop) => {
            const isSelected = selectedProposal?.id === prop.id;
            return (
              <div
                key={prop.id}
                onClick={() => setSelectedProposal(prop)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500/50 shadow-xl shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{prop.clientCompany}</span>
                      <span className="text-[10px] font-mono text-slate-400">{prop.version}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{prop.title}</p>
                  </div>
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                      prop.status === 'ACCEPTED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : prop.status === 'VIEWED'
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {prop.status}
                  </span>
                </div>

                {/* Engagement Telemetry Strip */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/60 grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block">Total Views</span>
                    <span className="font-mono font-bold text-slate-200 flex items-center gap-1">
                      <Eye className="h-3 w-3 text-indigo-400" />
                      {prop.engagement.totalViews} views
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Avg Time</span>
                    <span className="font-mono font-bold text-slate-200 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-400" />
                      {prop.engagement.avgTimeSpentMinutes}m
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Contract ARR</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatCurrency(prop.totalValue)}
                    </span>
                  </div>
                </div>

                {prop.rescueWarning && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>{prop.rescueWarning}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Proposal Spec Viewer & Editor */}
        <div className="lg:col-span-7">
          {selectedProposal ? (
            <div className="glass-panel rounded-2xl border border-slate-800/80 p-6 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Live Proposal Specification
                  </span>
                  <h3 className="text-lg font-bold text-white">{selectedProposal.title}</h3>
                  <p className="text-xs text-slate-400">
                    Client: {selectedProposal.clientCompany} • Total Value: {formatCurrency(selectedProposal.totalValue)} ARR
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewProposal(selectedProposal)}
                    className="h-8 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Executive View</span>
                  </button>
                </div>
              </div>

              {/* Proposal Sections */}
              <div className="space-y-4">
                {selectedProposal.sections.map((section) => (
                  <div
                    key={section.id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                          {section.title}
                        </h4>
                        {section.isAiGenerated && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                            AI Generated
                          </span>
                        )}
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={section.content}
                      onChange={(e) =>
                        updateProposalSection(selectedProposal.id, section.id, e.target.value)
                      }
                      className="w-full p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-emerald-500/50 resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl border border-slate-800/80 p-12 text-center text-slate-400 text-xs">
              Select a proposal to view details
            </div>
          )}
        </div>
      </div>

      {/* AI Proposal Builder Modal */}
      {showBuilderModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI Proposal Builder</h3>
                  <p className="text-xs text-slate-400">
                    Draft customized proposal specifications using opportunity intelligence
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBuilderModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Target Opportunity
                </label>
                <select
                  value={selectedOppId}
                  onChange={(e) => {
                    setSelectedOppId(e.target.value);
                    const o = opportunities.find((op) => op.id === e.target.value);
                    if (o) handleGenerateDraft(o);
                  }}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                >
                  {opportunities.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.company} ({formatCurrency(o.arr)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Proposal Template Spec
                </label>
                <select
                  value={templateType}
                  onChange={(e) => {
                    setTemplateType(e.target.value);
                    handleGenerateDraft();
                  }}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="ENTERPRISE_SaaS">Enterprise SaaS Platform</option>
                  <option value="AGENCY_RETAINER">Agency Revenue Retainer</option>
                  <option value="FINANCIAL_INTELLIGENCE">Financial Intelligence Suite</option>
                  <option value="CUSTOM_PILOT">Enterprise 30-Day Paid Pilot</option>
                </select>
              </div>
            </div>

            {/* AI Generated Sections Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  AI Drafted Spec Sections ({generatedSections.length})
                </span>
                <button
                  type="button"
                  onClick={() => handleGenerateDraft()}
                  disabled={isGenerating}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{isGenerating ? 'Regenerating...' : 'Regenerate Draft'}</span>
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto">
                {generatedSections.map((sec, idx) => (
                  <div key={sec.id || idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-emerald-400">{sec.title}</span>
                    <p className="text-xs text-slate-300 font-mono whitespace-pre-line">{sec.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowBuilderModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewProposal}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Proposal to Pipeline</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Executive Clean Preview Modal */}
      {previewProposal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-3xl bg-[#090b10] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold">
                  RR
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{previewProposal.title}</h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Prepared for: {previewProposal.clientCompany} • Value: {formatCurrency(previewProposal.totalValue)} ARR
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewProposal(null)}
                className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Close Preview
              </button>
            </div>

            <div className="space-y-6">
              {previewProposal.sections.map((sec) => (
                <div key={sec.id} className="space-y-2">
                  <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                    {sec.title}
                  </h4>
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    {sec.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
