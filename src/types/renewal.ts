export type ChurnRiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'HEALTHY';

export interface RenewalAccount {
  id: string;
  accountName: string;
  contractValue: number;
  currentTier: 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  renewalDate: string;
  daysUntilRenewal: number;
  healthScore: number; // 0 - 100
  churnRisk: ChurnRiskLevel;
  churnProbability: number; // 0 - 100%
  primaryContact: {
    name: string;
    email: string;
    role: string;
  };
  accountManager: string;
  npsScore?: number;
  usageTrend: 'GROWING' | 'FLAT' | 'DECLINING_SHARP' | 'DECLINING_SLOW';
  unresolvedTicketsCount: number;
  executiveSponsorActive: boolean;
  rescueActionRecommended: string;
  churnRiskDrivers: string[];
  status: 'PENDING_RENEWAL' | 'RESCUE_IN_PROGRESS' | 'RENEWED' | 'CHURNED';
}
