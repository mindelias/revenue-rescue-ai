export type ActivityType = 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'RESCUE_PLAYBOOK_EXECUTED' | 'PROPOSAL_VIEWED';

export interface Activity {
  id: string;
  opportunityId?: string;
  dealTitle?: string;
  type: ActivityType;
  title: string;
  description: string;
  performedBy: string;
  performedAt: string;
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'CAUTION' | 'NEGATIVE';
  impactSummary?: string;
  isAutomated?: boolean;
}

export interface FollowUpTask {
  id: string;
  opportunityId: string;
  dealTitle: string;
  company: string;
  arr: number;
  dealRiskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  recommendedReason: string;
  dueDate: string;
  isOverdue: boolean;
  isCompleted: boolean;
  priority: 'P0_URGENT' | 'P1_HIGH' | 'P2_MEDIUM';
  suggestedActionType: 'CALL' | 'EMAIL' | 'MEETING' | 'EXECUTIVE_ESCALATION';
}
