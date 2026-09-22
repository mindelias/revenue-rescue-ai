export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'HEALTHY';

export type DealStage = 
  | 'DISCOVERY' 
  | 'SOLUTION_MAPPING' 
  | 'PROPOSAL_OUT' 
  | 'EXECUTIVE_REVIEW' 
  | 'LEGAL_SECURITY' 
  | 'CLOSED_WON' 
  | 'CLOSED_LOST';

export interface Stakeholder {
  id: string;
  name: string;
  title: string;
  email: string;
  role: 'CHAMPION' | 'ECONOMIC_BUYER' | 'TECHNICAL_INFLUENCER' | 'BLOCKER' | 'UNKNOWN';
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'CAUTIOUS' | 'NEGATIVE';
  lastInteractedAt: string;
}

export interface RiskFactor {
  id: string;
  category: 'INACTIVITY' | 'STAKEHOLDER_ENGAGEMENT' | 'COMPETITIVE_THREAT' | 'DISCOUNT_PRESSURE' | 'VELOCITY_DROP' | 'PROPOSAL_STALL';
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  detectedAt: string;
  impactArr: number;
}

export interface RescuePlaybook {
  id: string;
  title: string;
  description: string;
  type: 'EXECUTIVE_ALIGNMENT' | 'OBJECTION_REBUTTAL' | 'PROPOSAL_RECALIBRATION' | 'CADENCE_ACCELERATOR' | 'SECURITY_ACCELERATOR';
  estimatedRecoveryChance: number; // 0 - 100%
  recommendedAction: string;
  draftedPayload?: {
    subject?: string;
    body?: string;
    discountPercent?: number;
    recommendedMeetingType?: string;
  };
  executed?: boolean;
  executedAt?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyLogoUrl?: string;
  industry: 'Fintech' | 'Enterprise SaaS' | 'Healthcare' | 'Consulting' | 'Insurance' | 'Cybersecurity';
  arr: number;
  stage: DealStage;
  ownerName: string;
  ownerAvatar?: string;
  riskScore: number; // 0 (Lowest risk / Healthy) to 100 (Critical leakage)
  riskLevel: RiskLevel;
  healthScore: number; // 0 to 100
  daysInStage: number;
  inactivityDays: number;
  expectedCloseDate: string;
  lastActivityDate: string;
  summary: string;
  stakeholders: Stakeholder[];
  riskFactors: RiskFactor[];
  recommendedPlaybooks: RescuePlaybook[];
  dealMemorySnippet: string;
}
