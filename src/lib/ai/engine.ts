import OpenAI from 'openai';
import { Opportunity } from '@/types/opportunity';
import { MemoryDocument, MemoryQueryResult } from '@/types/ai';
import {
  calculateDealRisk,
  queryDealMemoryHeuristic,
  generateProposalSectionsHeuristic,
} from './heuristic-rules';

export async function analyzeDealRiskAI(
  opportunity: Opportunity,
  apiKey?: string
) {
  // If OpenAI API Key is provided, attempt live LLM inference with graceful fallback
  if (apiKey || process.env.OPENAI_API_KEY) {
    try {
      const client = new OpenAI({
        apiKey: apiKey || process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const prompt = `You are the core intelligence engine of Revenue Rescue AI.
Analyze this deal:
Company: ${opportunity.company}
ARR: $${opportunity.arr}
Current Stage: ${opportunity.stage}
Days in Stage: ${opportunity.daysInStage}
Inactivity Days: ${opportunity.inactivityDays}
Summary: ${opportunity.summary}
Stakeholders: ${JSON.stringify(opportunity.stakeholders)}

Provide a JSON output with:
{
  "riskScore": number (0 to 100),
  "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "HEALTHY",
  "healthScore": number (0 to 100),
  "analysis": "string explanation of revenue risk and leakage causes",
  "recommendedAction": "specific next best action"
}`;

      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        return {
          ...calculateDealRisk(opportunity),
          riskScore: parsed.riskScore ?? opportunity.riskScore,
          riskLevel: parsed.riskLevel ?? opportunity.riskLevel,
          healthScore: parsed.healthScore ?? opportunity.healthScore,
          aiAnalysis: parsed.analysis,
          aiRecommendedAction: parsed.recommendedAction,
        };
      }
    } catch (err) {
      console.warn('OpenAI live call failed or key invalid, using deterministic fallback engine:', err);
    }
  }

  // Deterministic local inference engine
  return calculateDealRisk(opportunity);
}

export async function queryDealMemoryAI(
  query: string,
  corpus: MemoryDocument[],
  apiKey?: string
): Promise<MemoryQueryResult> {
  if (apiKey || process.env.OPENAI_API_KEY) {
    try {
      const client = new OpenAI({
        apiKey: apiKey || process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const corpusSnippet = corpus
        .map(
          (c) =>
            `[Doc ID: ${c.id}] Company: ${c.company} | Type: ${c.sourceType} | Date: ${c.timestamp} | Content: ${c.content}`
        )
        .join('\n\n');

      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are the AI Deal Memory engine for Revenue Rescue AI. Answer revenue and deal questions accurately based on indexed activity records.',
          },
          {
            role: 'user',
            content: `Indexed Activity Context:\n${corpusSnippet}\n\nUser Question: "${query}"\n\nProvide a concise, direct, executive-level answer highlighting deals at risk, blockers, stakeholder quotes, and recommended rescue playbooks.`,
          },
        ],
        temperature: 0.4,
      });

      const answer = response.choices[0]?.message?.content;
      if (answer) {
        const heuristicResult = queryDealMemoryHeuristic(query, corpus);
        return {
          query,
          answer,
          confidenceScore: 0.98,
          relatedDealIds: heuristicResult.relatedDealIds,
          citedSources: heuristicResult.citedSources,
          suggestedNextQuestions: heuristicResult.suggestedNextQuestions,
        };
      }
    } catch (err) {
      console.warn('OpenAI deal memory query failed, using deterministic fallback:', err);
    }
  }

  return queryDealMemoryHeuristic(query, corpus);
}

export async function generateProposalSectionsAI(
  deal: Opportunity,
  templateType: string,
  apiKey?: string
) {
  if (apiKey || process.env.OPENAI_API_KEY) {
    try {
      const client = new OpenAI({
        apiKey: apiKey || process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an Enterprise B2B Proposal Architect. Generate structured proposal spec sections in JSON.',
          },
          {
            role: 'user',
            content: `Generate a tailored executive proposal for:
Company: ${deal.company}
Industry: ${deal.industry}
ARR: $${deal.arr}
Deal Summary: ${deal.summary}
Template Type: ${templateType}

Output JSON format:
{
  "sections": [
    { "id": "sec-1", "title": "Executive Summary", "content": "..." },
    { "id": "sec-2", "title": "Scope & Technical Deliverables", "content": "..." },
    { "id": "sec-3", "title": "Commercial Investment & SLA", "content": "..." },
    { "id": "sec-4", "title": "Security & SOC2 Assurance", "content": "..." }
  ]
}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0]?.message?.content || '{}');
      if (parsed.sections && Array.isArray(parsed.sections)) {
        return parsed.sections.map((s: { id: string; title: string; content: string }) => ({
          ...s,
          isAiGenerated: true,
        }));
      }
    } catch (err) {
      console.warn('OpenAI proposal generation failed, using deterministic fallback:', err);
    }
  }

  return generateProposalSectionsHeuristic(deal, templateType);
}
