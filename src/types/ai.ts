export type AIProvider = 'OPENAI' | 'ANTHROPIC' | 'GEMINI' | 'BUILTIN_ENGINE';

export interface AISettings {
  provider: AIProvider;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  geminiApiKey?: string;
  riskSensitivity: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  inactivityThresholdDays: number;
  renewalAlertHorizonDays: number;
  activeTier: 'STARTER' | 'GROWTH' | 'REVENUE_INTELLIGENCE';
}

export interface MemoryDocument {
  id: string;
  dealId: string;
  dealTitle: string;
  company: string;
  sourceType: 'EMAIL' | 'CALL_TRANSCRIPT' | 'MEETING_NOTE' | 'PROPOSAL_SPEC' | 'EXECUTIVE_MEMO';
  timestamp: string;
  author: string;
  content: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'CAUTION' | 'NEGATIVE';
  tags: string[];
}

export interface MemoryQueryResult {
  query: string;
  answer: string;
  confidenceScore: number;
  relatedDealIds: string[];
  citedSources: Array<{
    documentId: string;
    sourceType: string;
    company: string;
    snippet: string;
    date: string;
  }>;
  suggestedNextQuestions: string[];
}
