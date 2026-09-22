import { Opportunity, RiskFactor, RescuePlaybook, RiskLevel } from '@/types/opportunity';
import { MemoryDocument, MemoryQueryResult } from '@/types/ai';

/**
 * Multi-Factor Risk Calculation Engine
 * Inactivity + Stage Stagnation + Stakeholder Sentiment + Competitive Threat + Redline Delay
 */
export function calculateDealRisk(
  opportunity: Partial<Opportunity> & {
    inactivityDays: number;
    daysInStage: number;
    stage: string;
    arr: number;
  }
): {
  riskScore: number;
  riskLevel: RiskLevel;
  healthScore: number;
  detectedFactors: RiskFactor[];
  recommendedPlaybooks: RescuePlaybook[];
} {
  let riskScore = 10; // baseline
  const factors: RiskFactor[] = [];
  const playbooks: RescuePlaybook[] = [];

  // Factor 1: Inactivity Decay
  if (opportunity.inactivityDays >= 14) {
    riskScore += 35;
    factors.push({
      id: `rf-inact-${Date.now()}`,
      category: 'INACTIVITY',
      title: `${opportunity.inactivityDays} Days Inactivity Detected`,
      severity: 'CRITICAL',
      description: 'Communication velocity has dropped significantly (>14 days without outbound interaction).',
      detectedAt: new Date().toISOString().split('T')[0],
      impactArr: opportunity.arr,
    });
  } else if (opportunity.inactivityDays >= 7) {
    riskScore += 20;
    factors.push({
      id: `rf-inact-${Date.now()}`,
      category: 'INACTIVITY',
      title: `${opportunity.inactivityDays} Days Inactivity Warning`,
      severity: 'HIGH',
      description: 'Over 1 week with no customer touchpoint or meeting scheduled.',
      detectedAt: new Date().toISOString().split('T')[0],
      impactArr: opportunity.arr,
    });
  }

  // Factor 2: Stage Stagnation
  if (opportunity.daysInStage >= 21 && opportunity.stage !== 'CLOSED_WON') {
    riskScore += 25;
    factors.push({
      id: `rf-stag-${Date.now()}`,
      category: 'VELOCITY_DROP',
      title: `Stage Stagnation (${opportunity.daysInStage} days in ${opportunity.stage})`,
      severity: 'HIGH',
      description: 'Deal is spending 2.4x longer in this stage compared to top quartile closing benchmarks.',
      detectedAt: new Date().toISOString().split('T')[0],
      impactArr: opportunity.arr,
    });
  }

  // Factor 3: Legal/Security friction
  if (opportunity.stage === 'LEGAL_SECURITY' && opportunity.daysInStage >= 14) {
    riskScore += 20;
    factors.push({
      id: `rf-legal-${Date.now()}`,
      category: 'PROPOSAL_STALL',
      title: 'Legal / Security Redline Bottleneck',
      severity: 'CRITICAL',
      description: 'Contract terms redlining has exceeded standard review turnaround threshold.',
      detectedAt: new Date().toISOString().split('T')[0],
      impactArr: opportunity.arr,
    });
    playbooks.push({
      id: `pb-leg-${Date.now()}`,
      title: 'Counsel-to-Counsel Fast Track Bridge',
      description: 'Host a 25-minute live attorney bridge with pre-approved indemnification and liability riders.',
      type: 'CADENCE_ACCELERATOR',
      estimatedRecoveryChance: 82,
      recommendedAction: 'Trigger Legal Bridge Protocol',
    });
  }

  // Generate Playbooks based on risk
  if (opportunity.inactivityDays >= 7) {
    playbooks.push({
      id: `pb-exec-${Date.now()}`,
      title: 'Executive Sponsor Multi-Threading Cadence',
      description: 'Send peer-to-peer alignment note from VP/CRO to unblock decision-making authority.',
      type: 'EXECUTIVE_ALIGNMENT',
      estimatedRecoveryChance: 78,
      recommendedAction: 'Launch Executive Outreach Sequence',
      draftedPayload: {
        subject: `Strategic Alignment: ${opportunity.company || 'Partnership'} Milestones & Goals`,
        body: `Hi there,\n\nI wanted to reach out directly to ensure our teams are closely aligned on your Q4 operational objectives. Let's reserve 15 minutes this week to align on priorities.\n\nBest regards,\nExecutive Team`,
      },
    });
  }

  // Cap risk score between 0 and 100
  riskScore = Math.min(100, Math.max(5, riskScore));
  const healthScore = Math.max(0, 100 - riskScore);

  let riskLevel: RiskLevel = 'LOW';
  if (riskScore >= 75) riskLevel = 'CRITICAL';
  else if (riskScore >= 55) riskLevel = 'HIGH';
  else if (riskScore >= 35) riskLevel = 'MEDIUM';
  else if (riskScore <= 15) riskLevel = 'HEALTHY';

  return {
    riskScore,
    riskLevel,
    healthScore,
    detectedFactors: factors,
    recommendedPlaybooks: playbooks,
  };
}

/**
 * Deterministic Semantic Deal Memory Query Matcher
 */
export function queryDealMemoryHeuristic(
  query: string,
  corpus: MemoryDocument[]
): MemoryQueryResult {
  const lowerQuery = query.toLowerCase();
  
  // Find matching documents based on keywords
  const matchedDocs = corpus.filter(doc => {
    const textToSearch = `${doc.dealTitle} ${doc.company} ${doc.content} ${doc.author} ${doc.tags.join(' ')}`.toLowerCase();
    
    // Check for keyword matches
    const keywords = lowerQuery.split(/\s+/).filter(w => w.length > 2);
    return keywords.some(k => textToSearch.includes(k));
  });

  const uniqueDeals = Array.from(new Set(matchedDocs.map(d => d.dealId)));
  const citedSources = matchedDocs.slice(0, 3).map(doc => ({
    documentId: doc.id,
    sourceType: doc.sourceType,
    company: doc.company,
    snippet: doc.content.length > 200 ? doc.content.substring(0, 200) + '...' : doc.content,
    date: doc.timestamp,
  }));

  // Generate intelligent answers based on common revenue query patterns
  let answer = '';
  const suggestedNextQuestions: string[] = [];

  if (lowerQuery.includes('inactive') || lowerQuery.includes('stalled') || lowerQuery.includes('risk') || lowerQuery.includes('leakage')) {
    answer = `**Revenue Rescue AI Risk Analysis:**\n\n• **Apex Global Logistics ($240k ARR)** has been inactive for **14 days**. Champion David Vance reported that CFO Marcus Sterling issued a freeze pending a Q4 compliance audit, while CISO Elena Rostova raised 18 compliance/SOC2 isolation questions.\n• **FinPulse Payments ($185k ARR)** has an active pricing blocker: Procurement lead Jonathan Drake requested a 12–15% concession or a 2-year upfront commitment to finalize Q3 signature.\n• **Meridian Health Systems ($320k ARR)** is stalled in Legal redlines over HIPAA Business Associate Agreement (BAA) indemnification limits.`;
    suggestedNextQuestions.push(
      'Draft an executive alignment email for Apex Logistics',
      'What pricing discount was requested by FinPulse Payments?',
      'Show me all renewal accounts renewing in under 30 days'
    );
  } else if (lowerQuery.includes('apex') || lowerQuery.includes('vance') || lowerQuery.includes('rostova')) {
    answer = `**Apex Global Logistics Context Summary:**\n\n• **Deal Value:** $240,000 ARR in Solution Mapping stage (23 days in stage, 14 days silent).\n• **Key Blocker:** CISO Elena Rostova is evaluating Splunk/Datadog security alternatives and requires verified SOC 2 Type II data boundary isolation and Customer-Managed Encryption Keys (CMEK).\n• **Recommended Rescue Action:** Schedule an Executive Alignment session between our VP of Engineering and CISO Elena Rostova with the pre-compiled security packet.`;
    suggestedNextQuestions.push(
      'Generate a tailored security packet for Elena Rostova',
      'What is the estimated recovery probability for Apex Logistics?'
    );
  } else if (lowerQuery.includes('finpulse') || lowerQuery.includes('pricing') || lowerQuery.includes('discount') || lowerQuery.includes('drake')) {
    answer = `**FinPulse Payments Pricing Breakdown:**\n\n• **Proposal Status:** Viewed 24 times across 6 stakeholders with heavy focus on Commercial Terms.\n• **Procurement Stance:** Jonathan Drake stated their engineering team gave technical sign-off, but requested either $140k for Year 1 or a 12-15% discount for a 2-year upfront commitment.\n• **Recommended Rescue Action:** Deploy the "Value-Preserving Tier Re-bundle" playbook offering a 12% discount in exchange for a 24-month contract term.`;
    suggestedNextQuestions.push(
      'Generate the 24-month multi-year proposal draft for FinPulse',
      'Who are the active stakeholders at FinPulse Payments?'
    );
  } else if (lowerQuery.includes('meridian') || lowerQuery.includes('legal') || lowerQuery.includes('baa') || lowerQuery.includes('campbell')) {
    answer = `**Meridian Health Systems Legal Summary:**\n\n• **Champion:** CMIO Dr. Arthur Campbell is highly supportive and targeting Nov 1 go-live for open enrollment.\n• **Legal Bottleneck:** Deputy General Counsel Patricia Vance redlined standard liability caps, requesting uncapped indemnity on hypothetical PHI data breaches.\n• **Recommended Rescue Action:** Convene a 25-minute attorney bridge session with our standard $10M super-cap rider.`;
    suggestedNextQuestions.push(
      'Schedule a Legal bridge session for Meridian Health Systems',
      'Show the activity history for Meridian Health'
    );
  } else if (lowerQuery.includes('cloudmatrix') || lowerQuery.includes('renewal') || lowerQuery.includes('churn')) {
    answer = `**CloudMatrix Technologies Churn Risk Brief:**\n\n• **Contract:** $145k ARR renewing in 22 days (Health Score: 31/100, Churn Probability: 82%).\n• **Root Causes:** New VP of Engineering Julian Hayes noted monthly active users dropped 46% and 7 P2 API stability tickets remain open in Jira.\n• **Recommended Rescue Action:** Assign a Dedicated CS Technical Architect immediately and present an executive remediation roadmap.`;
    suggestedNextQuestions.push(
      'Execute the CS Architect assignment playbook for CloudMatrix',
      'Show all renewal accounts sorted by churn probability'
    );
  } else {
    // General synthesis across matched documents
    if (matchedDocs.length > 0) {
      answer = `Based on our AI Deal Memory layer across **${matchedDocs.length} indexed records**:\n\n` +
        matchedDocs.map(d => `• **${d.company}** (${d.sourceType}, ${d.timestamp}): ${d.content.substring(0, 160)}...`).join('\n\n');
    } else {
      answer = `I analyzed our indexed emails, call transcripts, and proposal analytics. I found 6 active opportunities with a combined **$850,000 ARR at risk**. Key active bottlenecks include 14-day inactivity at Apex Global Logistics, procurement pricing negotiations at FinPulse Payments, and legal redlines at Meridian Health Systems.`;
    }
    suggestedNextQuestions.push(
      'Which deals have had no activity for over 10 days?',
      'Summarize the top pricing objections across all deals',
      'What are the highest-probability rescue playbooks to run today?'
    );
  }

  return {
    query,
    answer,
    confidenceScore: 0.94,
    relatedDealIds: uniqueDeals.length > 0 ? uniqueDeals : ['opp-101', 'opp-102'],
    citedSources: citedSources.length > 0 ? citedSources : corpus.slice(0, 2).map(d => ({
      documentId: d.id,
      sourceType: d.sourceType,
      company: d.company,
      snippet: d.content.substring(0, 180) + '...',
      date: d.timestamp,
    })),
    suggestedNextQuestions,
  };
}

/**
 * Deterministic AI Proposal Spec Generator
 */
export function generateProposalSectionsHeuristic(
  deal: Opportunity,
  templateType: string
) {
  return [
    {
      id: `sec-${Date.now()}-1`,
      title: 'Executive Summary & Business Objectives',
      isAiGenerated: true,
      content: `${deal.company} is partnering with Revenue Rescue AI to implement high-precision revenue intelligence, eliminate deal leakage, and automate multi-channel follow-up cadences. This deployment targets a minimum 3.8x ROI within the first 180 days by actively defending $${(deal.arr * 1.5).toLocaleString()} in pipeline velocity.`,
    },
    {
      id: `sec-${Date.now()}-2`,
      title: 'Target Architecture & Scope of Deliverables',
      isAiGenerated: true,
      content: `• Automated Inactivity & Deal Stagnation Risk Telemetry Engine\n• AI Deal Memory Layer with Cross-Platform Semantic Context Retrieval\n• 1-Click Executive Playbook Dispatcher (Multi-threading, Objection Rebuttals, Legal Bridges)\n• Dedicated Enterprise API & Real-Time Webhook Pipeline Integrations`,
    },
    {
      id: `sec-${Date.now()}-3`,
      title: 'Commercial Terms & Investment Schedule',
      isAiGenerated: true,
      content: `• Annual Platform Enterprise License: $${(deal.arr * 0.85).toLocaleString()} / year (Billed Annually)\n• Dedicated Technical Account Manager & Priority SLA: $${(deal.arr * 0.15).toLocaleString()} / year\n• Total Annual Investment: $${deal.arr.toLocaleString()} ARR\n• Payment Terms: Net-30 from agreement effective date.`,
    },
    {
      id: `sec-${Date.now()}-4`,
      title: 'Enterprise Security, SOC 2 Type II & SLA Guarantees',
      isAiGenerated: true,
      content: `• 99.99% Guaranteed Service Uptime with 15-minute Critical Response SLA\n• Dedicated Isolated Tenant VPC Architecture with AES-256 Encryption at Rest & In-Transit\n• Full SOC 2 Type II, HIPAA, and GDPR Compliance Standards. Zero customer telemetry used for public model training.`,
    },
  ];
}
