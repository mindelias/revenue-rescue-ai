'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  BrainCircuit,
  Sparkles,
  Send,
  MessageSquare,
  FileText,
  Clock,
  Search,
  CheckCircle2,
  Building,
  UserCheck,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useRevenueStore } from '@/lib/store/use-revenue-store';
import { useSettingsStore } from '@/lib/store/use-settings-store';
import { MemoryDocument, MemoryQueryResult } from '@/types/ai';

const SUGGESTION_PROMPTS = [
  'Which deals have had no activity for over 10 days?',
  'Summarize the Apex Global Logistics compliance objections',
  'What pricing concessions did FinPulse Payments request?',
  'Show all renewal accounts with churn probability > 60%',
  'What did CMIO Dr. Campbell say about Meridian Health go-live?',
];

export default function DealMemoryPage() {
  const { memoryCorpus } = useRevenueStore();
  const { aiSettings } = useSettingsStore();

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'CHAT' | 'CORPUS'>('CHAT');
  const [corpusFilter, setCorpusFilter] = useState<'ALL' | 'EMAIL' | 'CALL_TRANSCRIPT' | 'MEETING_NOTE' | 'EXECUTIVE_MEMO'>('ALL');

  // Conversation history state
  const [chatHistory, setChatHistory] = useState<
    Array<{
      id: string;
      query: string;
      result: MemoryQueryResult;
      timestamp: string;
    }>
  >([
    {
      id: 'default-1',
      query: 'Which deals have had no activity for over 10 days?',
      result: {
        query: 'Which deals have had no activity for over 10 days?',
        answer:
          '**Revenue Rescue AI Risk Telemetry:**\n\n• **Apex Global Logistics ($240k ARR)**: **14 days silent** in Solution Mapping. Champion David Vance reported a CFO audit freeze, while CISO Elena Rostova raised 18 unanswered SOC2 compliance queries.\n• **Meridian Health Systems ($320k ARR)**: **11 days silent** in Legal redlines. Deputy General Counsel Patricia Vance has redlined BAA indemnity limits.\n• **FinPulse Payments ($185k ARR)**: **9 days silent** following procurement pushback from Jonathan Drake for a 12-15% discount.',
        confidenceScore: 0.96,
        relatedDealIds: ['opp-101', 'opp-103', 'opp-102'],
        citedSources: [
          {
            documentId: 'mem-1',
            sourceType: 'EMAIL',
            company: 'Apex Global Logistics',
            snippet: 'CFO Marcus Sterling asked to pause all new enterprise software approvals while we finalize the Q4 compliance audit...',
            date: '2026-09-08 14:22',
          },
          {
            documentId: 'mem-4',
            sourceType: 'MEETING_NOTE',
            company: 'Meridian Health Systems',
            snippet: 'Deputy General Counsel Patricia Vance has redlined our BAA indemnity section. She wants full uncapped liability...',
            date: '2026-09-11 16:00',
          },
        ],
        suggestedNextQuestions: [
          'Draft an executive alignment email for Apex Logistics',
          'Schedule a legal bridge call for Meridian Health',
        ],
      },
      timestamp: 'Today at 09:30 AM',
    },
  ]);

  const handleRunQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/deal-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          corpus: memoryCorpus,
          apiKey: aiSettings.openaiApiKey,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setChatHistory((prev) => [
          {
            id: `chat-${Date.now()}`,
            query: queryText,
            result: json.data,
            timestamp: 'Just now',
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error('Failed to query deal memory:', err);
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  const filteredCorpus = memoryCorpus.filter((doc) => {
    if (corpusFilter === 'ALL') return true;
    return doc.sourceType === corpusFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-[#0a0d14] p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden md:block opacity-35 mix-blend-screen pointer-events-none">
          <Image
            src="/assets/deal_memory_mesh.jpg"
            alt="AI Deal Memory Knowledge Mesh"
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold">
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>Semantic Deal Memory Layer • {memoryCorpus.length} Indexed Context Records</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            AI Deal Memory & Natural Language Q&A
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Instantly query across meeting recordings, customer emails, legal redlines, and proposal views. Eliminate information silos and rescue deals before they stall.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setActiveTab('CHAT')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'CHAT'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Ask AI Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('CORPUS')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'CORPUS'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Browse Knowledge Corpus ({memoryCorpus.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'CHAT' && (
        <div className="space-y-6">
          {/* Query Bar */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 shadow-2xl space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRunQuery(query);
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <BrainCircuit className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                <input
                  type="text"
                  placeholder="Ask anything about deals, blockers, pricing discussions, or renewals..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isLoading ? 'Querying...' : 'Ask AI'}</span>
              </button>
            </form>

            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-indigo-400" /> Suggested:
              </span>
              {SUGGESTION_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunQuery(prompt)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-slate-300 hover:text-white transition-all cursor-pointer text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="space-y-4">
            {chatHistory.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-5 animate-fade-in"
              >
                {/* User Prompt */}
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 text-xs font-bold">
                      Q
                    </div>
                    <span className="text-sm font-bold text-white">{item.query}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {item.timestamp}
                  </span>
                </div>

                {/* AI Answer */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                    <BrainCircuit className="h-4 w-4" />
                    <span>AI Deal Memory Synthesis</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                      Confidence: {Math.round(item.result.confidenceScore * 100)}%
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 font-sans">
                    {item.result.answer}
                  </div>
                </div>

                {/* Cited Sources */}
                {item.result.citedSources && item.result.citedSources.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Cited Context Sources ({item.result.citedSources.length})
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {item.result.citedSources.map((source, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-emerald-400 flex items-center gap-1">
                              <Building className="h-3 w-3" /> {source.company}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {source.sourceType} • {source.date}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                            "{source.snippet}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: BROWSE KNOWLEDGE CORPUS */}
      {activeTab === 'CORPUS' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 mr-2">Filter Source:</span>
            {['ALL', 'EMAIL', 'CALL_TRANSCRIPT', 'MEETING_NOTE', 'EXECUTIVE_MEMO'].map((type) => (
              <button
                key={type}
                onClick={() => setCorpusFilter(type as typeof corpusFilter)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  corpusFilter === type
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCorpus.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5" />
                      {doc.company}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {doc.sourceType.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-200">{doc.author}</div>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                    {doc.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {doc.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono">{doc.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
