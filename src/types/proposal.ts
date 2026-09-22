export type ProposalStatus = 'DRAFT' | 'AI_GENERATED' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'STALLED' | 'EXPIRED';

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  isAiGenerated?: boolean;
}

export interface ProposalEngagement {
  totalViews: number;
  lastViewedAt?: string;
  avgTimeSpentMinutes: number;
  mostViewedSection: string;
  pricingViewedCount: number;
}

export interface Proposal {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  clientCompany: string;
  title: string;
  version: string;
  totalValue: number;
  status: ProposalStatus;
  createdAt: string;
  expiresAt: string;
  sections: ProposalSection[];
  engagement: ProposalEngagement;
  templateType: 'ENTERPRISE_SaaS' | 'AGENCY_RETAINER' | 'FINANCIAL_INTELLIGENCE' | 'CUSTOM_PILOT';
  rescueWarning?: string;
}
