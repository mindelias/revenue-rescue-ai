import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Opportunity, DealStage, RescuePlaybook } from '@/types/opportunity';
import { RenewalAccount } from '@/types/renewal';
import { Proposal } from '@/types/proposal';
import { Activity, FollowUpTask } from '@/types/activity';
import { MemoryDocument } from '@/types/ai';
import { INITIAL_OPPORTUNITIES } from '@/lib/mock-data/opportunities';
import { INITIAL_RENEWALS } from '@/lib/mock-data/renewals';
import { INITIAL_PROPOSALS } from '@/lib/mock-data/proposals';
import { INITIAL_ACTIVITIES, INITIAL_FOLLOW_UPS } from '@/lib/mock-data/activities';
import { INITIAL_MEMORY_CORPUS } from '@/lib/mock-data/memory-corpus';

interface RevenueHealthBreakdown {
  compositeScore: number; // 0 - 100
  pipelineHealth: number;
  renewalHealth: number;
  proposalHealth: number;
  activityHealth: number;
  totalArrAtRisk: number;
  totalPipelineArr: number;
  totalRenewalArr: number;
  criticalRiskCount: number;
}

interface RevenueState {
  opportunities: Opportunity[];
  renewals: RenewalAccount[];
  proposals: Proposal[];
  activities: Activity[];
  followUps: FollowUpTask[];
  memoryCorpus: MemoryDocument[];
  selectedOpportunityId: string | null;

  // Actions
  setSelectedOpportunityId: (id: string | null) => void;
  updateOpportunityStage: (id: string, stage: DealStage) => void;
  executeRescuePlaybook: (opportunityId: string, playbookId: string, customMessage?: string) => void;
  addOpportunity: (opp: Opportunity) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'performedAt'>) => void;
  completeFollowUp: (taskId: string) => void;
  executeRenewalRescue: (renewalId: string, rescueAction: string) => void;
  addProposal: (proposal: Proposal) => void;
  updateProposalSection: (proposalId: string, sectionId: string, content: string) => void;
  addMemoryDocument: (doc: Omit<MemoryDocument, 'id' | 'timestamp'>) => void;
  getRevenueHealthMetrics: () => RevenueHealthBreakdown;
  resetToSampleData: () => void;
}

export const useRevenueStore = create<RevenueState>()(
  persist(
    (set, get) => ({
      opportunities: INITIAL_OPPORTUNITIES,
      renewals: INITIAL_RENEWALS,
      proposals: INITIAL_PROPOSALS,
      activities: INITIAL_ACTIVITIES,
      followUps: INITIAL_FOLLOW_UPS,
      memoryCorpus: INITIAL_MEMORY_CORPUS,
      selectedOpportunityId: null,

      setSelectedOpportunityId: (id) => set({ selectedOpportunityId: id }),

      updateOpportunityStage: (id, stage) => {
        set((state) => {
          const opps = state.opportunities.map((opp) => {
            if (opp.id === id) {
              const updated = {
                ...opp,
                stage,
                daysInStage: 1,
                lastActivityDate: new Date().toISOString().split('T')[0],
              };
              if (stage === 'CLOSED_WON') {
                updated.riskScore = 5;
                updated.riskLevel = 'HEALTHY';
                updated.healthScore = 98;
              }
              return updated;
            }
            return opp;
          });
          return { opportunities: opps };
        });

        // Log stage change activity
        const opp = get().opportunities.find((o) => o.id === id);
        if (opp) {
          get().addActivity({
            opportunityId: id,
            dealTitle: `${opp.title} (${opp.company})`,
            type: 'NOTE',
            title: `Stage Updated to ${stage.replace('_', ' ')}`,
            description: `Deal progressed to ${stage}. Inactivity timer reset.`,
            performedBy: 'Revenue Operations',
            sentiment: 'POSITIVE',
            impactSummary: 'Stage progression recorded in pipeline telemetry',
          });
        }
      },

      executeRescuePlaybook: (opportunityId, playbookId, customMessage) => {
        const state = get();
        const opp = state.opportunities.find((o) => o.id === opportunityId);
        if (!opp) return;

        const playbook = opp.recommendedPlaybooks.find((p) => p.id === playbookId);
        const playbookTitle = playbook ? playbook.title : 'Targeted Rescue Outreach';

        // Update opportunity risk score downwards and record execution
        const updatedOpps = state.opportunities.map((o) => {
          if (o.id === opportunityId) {
            const newScore = Math.max(15, o.riskScore - 30);
            return {
              ...o,
              riskScore: newScore,
              riskLevel: (newScore > 50 ? 'MEDIUM' : 'LOW') as Opportunity['riskLevel'],
              healthScore: Math.min(95, o.healthScore + 25),
              inactivityDays: 0,
              lastActivityDate: new Date().toISOString().split('T')[0],
              recommendedPlaybooks: o.recommendedPlaybooks.map((p) =>
                p.id === playbookId ? { ...p, executed: true, executedAt: new Date().toISOString() } : p
              ),
            };
          }
          return o;
        });

        // Add to activities
        const newActivity: Activity = {
          id: `act-${Date.now()}`,
          opportunityId,
          dealTitle: `${opp.title} (${opp.company})`,
          type: 'RESCUE_PLAYBOOK_EXECUTED',
          title: `Executed Rescue Playbook: ${playbookTitle}`,
          description: customMessage || playbook?.description || 'Automated multi-threaded executive outreach dispatched.',
          performedBy: 'Revenue Rescue AI (Autonomous)',
          performedAt: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          sentiment: 'POSITIVE',
          impactSummary: 'Risk score reduced by -30 pts. Inactivity counter reset.',
          isAutomated: true,
        };

        // Complete any related follow up
        const updatedFollowUps = state.followUps.map((t) =>
          t.opportunityId === opportunityId ? { ...t, isCompleted: true } : t
        );

        // Add to memory corpus
        const newMemoryDoc: MemoryDocument = {
          id: `mem-rescue-${Date.now()}`,
          dealId: opportunityId,
          dealTitle: opp.title,
          company: opp.company,
          sourceType: 'EXECUTIVE_MEMO',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          author: 'Revenue Rescue AI Playbook',
          content: `Executed ${playbookTitle}. Payload: "${customMessage || playbook?.description}". High recovery probability response generated.`,
          sentiment: 'POSITIVE',
          tags: ['Rescue Executed', 'Playbook', 'De-risked'],
        };

        set({
          opportunities: updatedOpps,
          activities: [newActivity, ...state.activities],
          followUps: updatedFollowUps,
          memoryCorpus: [newMemoryDoc, ...state.memoryCorpus],
        });
      },

      addOpportunity: (opp) => {
        set((state) => ({
          opportunities: [opp, ...state.opportunities],
        }));
      },

      addActivity: (activityData) => {
        const newActivity: Activity = {
          ...activityData,
          id: `act-${Date.now()}`,
          performedAt: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        set((state) => ({
          activities: [newActivity, ...state.activities],
        }));
      },

      completeFollowUp: (taskId) => {
        set((state) => ({
          followUps: state.followUps.map((t) =>
            t.id === taskId ? { ...t, isCompleted: true } : t
          ),
        }));
      },

      executeRenewalRescue: (renewalId, rescueAction) => {
        set((state) => ({
          renewals: state.renewals.map((r) => {
            if (r.id === renewalId) {
              return {
                ...r,
                status: 'RESCUE_IN_PROGRESS',
                healthScore: Math.min(85, r.healthScore + 20),
                churnProbability: Math.max(15, r.churnProbability - 35),
                churnRisk: 'MODERATE',
              };
            }
            return r;
          }),
        }));

        const account = get().renewals.find((r) => r.id === renewalId);
        if (account) {
          get().addActivity({
            type: 'RESCUE_PLAYBOOK_EXECUTED',
            title: `Renewal Rescue Dispatched: ${account.accountName}`,
            description: rescueAction,
            performedBy: 'Account Management',
            sentiment: 'POSITIVE',
            impactSummary: 'Churn probability reduced by 35%. Dedicated architect assigned.',
          });
        }
      },

      addProposal: (proposal) => {
        set((state) => ({
          proposals: [proposal, ...state.proposals],
        }));
      },

      updateProposalSection: (proposalId, sectionId, content) => {
        set((state) => ({
          proposals: state.proposals.map((p) => {
            if (p.id === proposalId) {
              return {
                ...p,
                sections: p.sections.map((s) =>
                  s.id === sectionId ? { ...s, content } : s
                ),
              };
            }
            return p;
          }),
        }));
      },

      addMemoryDocument: (docData) => {
        const newDoc: MemoryDocument = {
          ...docData,
          id: `mem-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
        set((state) => ({
          memoryCorpus: [newDoc, ...state.memoryCorpus],
        }));
      },

      getRevenueHealthMetrics: () => {
        const state = get();
        const opps = state.opportunities;
        const renewals = state.renewals;
        const proposals = state.proposals;

        const totalPipelineArr = opps.reduce((sum, o) => sum + o.arr, 0);
        const totalRenewalArr = renewals.reduce((sum, r) => sum + r.contractValue, 0);

        // At risk ARR = Deals with riskScore > 50 + renewals with churn probability > 50%
        const atRiskDealArr = opps
          .filter((o) => o.riskScore >= 50 && o.stage !== 'CLOSED_WON')
          .reduce((sum, o) => sum + o.arr, 0);
        const atRiskRenewalArr = renewals
          .filter((r) => r.churnProbability >= 50 && r.status !== 'RENEWED')
          .reduce((sum, r) => sum + r.contractValue, 0);

        const totalArrAtRisk = atRiskDealArr + atRiskRenewalArr;

        // Pipeline Health: average healthScore of active opportunities
        const activeOpps = opps.filter((o) => o.stage !== 'CLOSED_LOST');
        const pipelineHealth = activeOpps.length
          ? Math.round(activeOpps.reduce((sum, o) => sum + o.healthScore, 0) / activeOpps.length)
          : 75;

        // Renewal Health: average healthScore of renewals
        const renewalHealth = renewals.length
          ? Math.round(renewals.reduce((sum, r) => sum + r.healthScore, 0) / renewals.length)
          : 80;

        // Proposal Health: ratio of viewed/accepted vs stalled/expired
        const acceptedOrViewed = proposals.filter((p) => p.status === 'ACCEPTED' || p.status === 'VIEWED').length;
        const proposalHealth = proposals.length
          ? Math.round((acceptedOrViewed / proposals.length) * 100)
          : 85;

        // Activity Health: ratio of completed follow-ups
        const completedTasks = state.followUps.filter((t) => t.isCompleted).length;
        const activityHealth = state.followUps.length
          ? Math.round((completedTasks / state.followUps.length) * 100)
          : 70;

        // Composite Health Formula: 30% Pipeline + 25% Renewal + 20% Proposal + 15% Activity + 10% Risk Inversion
        const riskInversion = Math.max(0, 100 - Math.round((totalArrAtRisk / (totalPipelineArr + totalRenewalArr || 1)) * 100));
        const compositeScore = Math.min(
          100,
          Math.max(
            10,
            Math.round(
              pipelineHealth * 0.3 +
              renewalHealth * 0.25 +
              proposalHealth * 0.2 +
              activityHealth * 0.15 +
              riskInversion * 0.1
            )
          )
        );

        const criticalRiskCount =
          opps.filter((o) => o.riskLevel === 'CRITICAL' && o.stage !== 'CLOSED_WON').length +
          renewals.filter((r) => r.churnRisk === 'CRITICAL').length;

        return {
          compositeScore,
          pipelineHealth,
          renewalHealth,
          proposalHealth,
          activityHealth,
          totalArrAtRisk,
          totalPipelineArr,
          totalRenewalArr,
          criticalRiskCount,
        };
      },

      resetToSampleData: () => {
        set({
          opportunities: INITIAL_OPPORTUNITIES,
          renewals: INITIAL_RENEWALS,
          proposals: INITIAL_PROPOSALS,
          activities: INITIAL_ACTIVITIES,
          followUps: INITIAL_FOLLOW_UPS,
          memoryCorpus: INITIAL_MEMORY_CORPUS,
          selectedOpportunityId: null,
        });
      },
    }),
    {
      name: 'revenue-rescue-ai-storage-v1',
    }
  )
);
