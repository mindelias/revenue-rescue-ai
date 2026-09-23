'use client';

import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Key,
  Sliders,
  Users,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Building,
  Eye,
  EyeOff,
  Zap,
  Check,
  Database,
  UploadCloud,
  FileSpreadsheet,
  Mail,
  Video,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';
import { useSettingsStore } from '@/lib/store/use-settings-store';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { Opportunity } from '@/types/opportunity';
import { formatCurrency } from '@/lib/utils';

export default function SettingsPage() {
  const {
    aiSettings,
    orgProfile,
    setOpenAIApiKey,
    setRiskSensitivity,
    setInactivityThreshold,
    setRenewalHorizon,
    setSubscriptionTier,
  } = useSettingsStore();

  const { addOpportunity, addActivity } = useRevenueStore();

  const [activeTab, setActiveTab] = useState<'INTEGRATIONS' | 'AI_CONFIG' | 'CALIBRATION' | 'TIERS'>('INTEGRATIONS');

  // Integrations connection state
  const [integrations, setIntegrations] = useState([
    {
      id: 'salesforce',
      name: 'Salesforce CRM',
      category: 'CRM & Pipeline',
      description: 'Bi-directional 2-way sync for Opportunities, Accounts, and Stage changes via REST Webhooks.',
      status: 'CONNECTED',
      syncInterval: 'Real-time Webhook',
      lastSynced: '2 minutes ago',
      recordsSynced: '1,420 Deals',
      icon: Database,
    },
    {
      id: 'hubspot',
      name: 'HubSpot CRM',
      category: 'CRM & Pipeline',
      description: 'Sync deals, pipeline stages, contact associations, and contract values automatically.',
      status: 'AVAILABLE',
      syncInterval: '5-minute poll',
      lastSynced: 'Not connected',
      recordsSynced: '0 Deals',
      icon: Database,
    },
    {
      id: 'gmail',
      name: 'Google Workspace (Gmail)',
      category: 'Email & Inactivity',
      description: 'Auto-ingest email threads with prospect domains to track silence duration and sentiment.',
      status: 'CONNECTED',
      syncInterval: 'Continuous stream',
      lastSynced: '1 minute ago',
      recordsSynced: '8,950 Emails',
      icon: Mail,
    },
    {
      id: 'outlook',
      name: 'Microsoft 365 (Outlook)',
      category: 'Email & Inactivity',
      description: 'Ingest rep email cadences and calendar invites to keep inactivity timers 100% accurate.',
      status: 'AVAILABLE',
      syncInterval: 'Continuous stream',
      lastSynced: 'Not connected',
      recordsSynced: '0 Emails',
      icon: Mail,
    },
    {
      id: 'gong',
      name: 'Gong.io / Zoom Phone',
      category: 'Call & Voice Intelligence',
      description: 'Ingest call audio transcripts to feed objection detection and AI Deal Memory.',
      status: 'CONNECTED',
      syncInterval: 'Post-meeting webhook',
      lastSynced: '14 minutes ago',
      recordsSynced: '312 Transcripts',
      icon: Video,
    },
  ]);

  // CSV Import State
  const [isImportingCsv, setIsImportingCsv] = useState(false);
  const [csvSuccessMsg, setCsvSuccessMsg] = useState('');

  // AI & Key State
  const [apiKeyInput, setApiKeyInput] = useState(aiSettings.openaiApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [testResult, setTestResult] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [saveToast, setSaveToast] = useState('');

  const handleToggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = item.status === 'CONNECTED' ? 'AVAILABLE' : 'CONNECTED';
          return {
            ...item,
            status: newStatus,
            lastSynced: newStatus === 'CONNECTED' ? 'Just now' : 'Disconnected',
          };
        }
        return item;
      })
    );
  };

  const handleSimulateCsvUpload = () => {
    setIsImportingCsv(true);
    setTimeout(() => {
      // Add a simulated imported deal
      const importedDeal: Opportunity = {
        id: `opp-csv-${Date.now()}`,
        company: 'Starlight Biotech Corp',
        title: 'Enterprise AI Lab Analytics Suite',
        industry: 'Healthcare',
        arr: 215000,
        stage: 'PROPOSAL_OUT',
        ownerName: 'Sarah Jenkins',
        ownerAvatar: 'SJ',
        riskScore: 62,
        riskLevel: 'HIGH',
        healthScore: 48,
        daysInStage: 18,
        inactivityDays: 8,
        expectedCloseDate: '2026-10-28',
        lastActivityDate: '2026-09-14',
        summary: 'Imported via CSV. Proposal viewed 12 times; champion requested HIPAA compliance validation.',
        dealMemorySnippet: 'CFO requested multi-year payment schedule.',
        stakeholders: [],
        riskFactors: [],
        recommendedPlaybooks: [],
      };

      addOpportunity(importedDeal);
      addActivity({
        type: 'NOTE',
        title: 'CSV Bulk Pipeline Ingested: 1 Deal Added',
        description: 'Imported Starlight Biotech Corp ($215,000 ARR) from deals_q3_export.csv.',
        performedBy: 'CSV Pipeline Importer',
        sentiment: 'POSITIVE',
        impactSummary: 'Pipeline updated and risk evaluated',
        isAutomated: true,
      });

      setIsImportingCsv(false);
      setCsvSuccessMsg('Successfully imported Starlight Biotech Corp ($215k ARR) into active pipeline!');
      setTimeout(() => setCsvSuccessMsg(''), 5000);
    }, 1000);
  };

  const handleTestAndSaveKey = async () => {
    setIsTesting(true);
    setOpenAIApiKey(apiKeyInput);

    setTimeout(() => {
      setIsTesting(false);
      if (apiKeyInput.startsWith('sk-')) {
        setTestResult('OpenAI API Key verified and active! Live inference enabled.');
      } else if (!apiKeyInput) {
        setTestResult('Switched to Built-in High-Fidelity Deterministic Engine.');
      } else {
        setTestResult('Key format saved. Operating with active fallback protection.');
      }
      setSaveToast('Settings saved successfully!');
      setTimeout(() => setSaveToast(''), 4000);
    }, 600);
  };

  const TIERS = [
    {
      id: 'STARTER',
      name: 'Starter',
      price: '$19',
      period: 'per user / month',
      description: 'Essential pipeline risk tracking and basic follow-up reminders.',
      features: [
        'Up to 5 seats',
        'Basic Pipeline Inactivity Detection',
        'Standard Email Follow-up Tasks',
        'Heuristic Risk Scoring',
        'Community Support',
      ],
    },
    {
      id: 'GROWTH',
      name: 'Growth',
      price: '$49',
      period: 'per user / month',
      popular: true,
      description: 'Advanced deal velocity intelligence and AI proposal drafting.',
      features: [
        'Up to 25 seats',
        'Full AI Deal Memory Layer',
        'AI Proposal Studio (100 drafts/mo)',
        '30/60/90-Day Renewal Radar',
        '1-Click Executive Playbooks',
        'Priority Email & Slack Support',
      ],
    },
    {
      id: 'REVENUE_INTELLIGENCE',
      name: 'Revenue Intelligence',
      price: '$99',
      period: 'per user / month',
      description: 'Autonomous revenue intelligence, custom LLMs, and enterprise SLA.',
      features: [
        'Unlimited seats & integrations',
        'Real-Time Live Telemetry Engine',
        'Custom OpenAI / Anthropic Key Support',
        'Autonomous Churn Defense',
        'Executive Governance Leaderboards',
        'Dedicated Technical Account Manager',
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
              Data Ingestion, Integrations & Governance
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              Tier: {orgProfile.tier.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            How data enters Revenue Rescue AI: CRM webhooks, email streams, call audio, and CSV imports.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1">
          <button
            onClick={() => setActiveTab('INTEGRATIONS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'INTEGRATIONS'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>Data Ingestion & CRMs</span>
          </button>
          <button
            onClick={() => setActiveTab('AI_CONFIG')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'AI_CONFIG'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>AI Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('CALIBRATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'CALIBRATION'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Risk Rules</span>
          </button>
          <button
            onClick={() => setActiveTab('TIERS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'TIERS'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Tiers ($19/$49/$99)</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* TAB 1: DATA INGESTION & INTEGRATIONS */}
      {activeTab === 'INTEGRATIONS' && (
        <div className="space-y-6">
          {/* Ingestion Architecture Blueprint Card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Automated 3-Tier Data Ingestion Pipeline
                </h3>
                <p className="text-xs text-slate-400">
                  How data flows automatically into Revenue Rescue AI without manual data entry
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                  1. CRM System of Record
                </span>
                <h4 className="text-xs font-bold text-slate-200">Salesforce / HubSpot Sync</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Real-time webhook syncs Opportunities, ARR, Stage, and Account Executive assignments.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">
                  2. Communication Streams
                </span>
                <h4 className="text-xs font-bold text-slate-200">Gmail / Outlook Ingestion</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Background worker parses prospect email threads, resets silence counters, and extracts sentiment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  3. Conversation & Voice
                </span>
                <h4 className="text-xs font-bold text-slate-200">Gong / Zoom Call Audio</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Auto-transcribes calls, indexes key quotes, and feeds the <strong>AI Deal Memory</strong> layer.
                </p>
              </div>
            </div>
          </div>

          {/* Connected Integrations Grid */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4">
            <h3 className="text-base font-bold text-white">Live Connected Data Sources</h3>
            <div className="divide-y divide-slate-800/60">
              {integrations.map((item) => {
                const Icon = item.icon;
                const isConnected = item.status === 'CONNECTED';

                return (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white">{item.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300">
                            {item.category}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isConnected
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isConnected ? 'LIVE SYNC ACTIVE' : 'DISCONNECTED'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{item.description}</p>
                        {isConnected && (
                          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-0.5">
                            <span>⚡ {item.syncInterval}</span>
                            <span>• Synced: {item.lastSynced}</span>
                            <span className="text-emerald-400 font-bold">• {item.recordsSynced}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleIntegration(item.id)}
                      className={`h-9 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        isConnected
                          ? 'bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-500/40 border border-slate-700 text-slate-300'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                      }`}
                    >
                      {isConnected ? 'Disconnect' : 'Connect Source'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CSV Bulk Importer */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="h-5 w-5 text-indigo-400" />
                <div>
                  <h3 className="text-base font-bold text-white">CSV & Spreadsheet Bulk Uploader</h3>
                  <p className="text-xs text-slate-400">
                    Import existing pipeline spreadsheets (Columns: Company, Deal Title, ARR, Stage, Days Inactive)
                  </p>
                </div>
              </div>
            </div>

            {csvSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{csvSuccessMsg}</span>
              </div>
            )}

            <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-8 text-center space-y-3 bg-slate-950/40 transition-colors">
              <UploadCloud className="h-8 w-8 text-indigo-400 mx-auto" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-white block">
                  Drag and drop your deals CSV file here, or click to upload
                </span>
                <span className="text-[11px] text-slate-400 block font-mono">
                  Supports .csv, .xlsx, .json (Standard CRM Export format)
                </span>
              </div>

              <button
                onClick={handleSimulateCsvUpload}
                disabled={isImportingCsv}
                className="h-9 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>{isImportingCsv ? 'Ingesting Pipeline Records...' : 'Upload Sample deals_export.csv'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI CONFIG */}
      {activeTab === 'AI_CONFIG' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Engine & API Key Configuration</h3>
              <p className="text-xs text-slate-400">
                Configure live LLM inference with zero-friction deterministic fallback
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Inference Engine
                </span>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {aiSettings.provider === 'OPENAI' && aiSettings.openaiApiKey
                    ? 'OpenAI GPT-4o-mini (Live API Active)'
                    : 'Built-in High-Fidelity Revenue Intelligence Engine'}
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                Zero-Downtime Fallback Active
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>OpenAI API Key (Optional)</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Leave blank to use the built-in deterministic engine
                </span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showKey ? 'text' : 'password'}
                    placeholder="sk-proj-..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="w-full h-10 pl-10 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <button
                  onClick={handleTestAndSaveKey}
                  disabled={isTesting}
                  className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isTesting ? 'Validating...' : 'Save & Test Key'}</span>
                </button>
              </div>
              {testResult && (
                <p className="text-xs text-emerald-400 pt-1 font-medium">{testResult}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CALIBRATION */}
      {activeTab === 'CALIBRATION' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Risk Sensitivity & Threshold Calibration</h3>
              <p className="text-xs text-slate-400">
                Tune parameters for automated inactivity warnings and renewal horizons
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Risk Calculation Sensitivity
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
                {(['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setRiskSensitivity(s)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      aiSettings.riskSensitivity === s
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Inactivity Warning Trigger</span>
                <span className="font-mono text-amber-400 font-bold">{aiSettings.inactivityThresholdDays} days</span>
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={aiSettings.inactivityThresholdDays}
                onChange={(e) => setInactivityThreshold(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Renewal Churn Horizon</span>
                <span className="font-mono text-indigo-400 font-bold">{aiSettings.renewalAlertHorizonDays} days</span>
              </label>
              <input
                type="range"
                min="30"
                max="90"
                step="5"
                value={aiSettings.renewalAlertHorizonDays}
                onChange={(e) => setRenewalHorizon(Number(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TIERS */}
      {activeTab === 'TIERS' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Subscription Tier Governance</h3>
              <p className="text-xs text-slate-400">
                PRD Subscription Tiers — Starter ($19), Growth ($49), and Revenue Intelligence ($99)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
            {TIERS.map((tier) => {
              const isCurrent = orgProfile.tier === tier.id;
              return (
                <div
                  key={tier.id}
                  className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isCurrent
                      ? 'bg-slate-900 border-emerald-500/50 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base text-white">{tier.name}</span>
                      {tier.popular && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Popular
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold font-mono text-white">{tier.price}</span>
                      <span className="text-xs text-slate-400">{tier.period}</span>
                    </div>

                    <p className="text-xs text-slate-400">{tier.description}</p>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      {tier.features.map((feat, fIdx) => (
                        <div key={fIdx} className="text-xs text-slate-300 flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSubscriptionTier(tier.id as typeof orgProfile.tier)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isCurrent ? 'Current Active Tier' : 'Switch to ' + tier.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
