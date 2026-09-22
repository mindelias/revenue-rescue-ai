import { NextRequest, NextResponse } from 'next/server';
import { analyzeDealRiskAI } from '@/lib/ai/engine';
import { Opportunity } from '@/types/opportunity';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { opportunity, apiKey } = body as { opportunity: Opportunity; apiKey?: string };

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity data is required' }, { status: 400 });
    }

    const result = await analyzeDealRiskAI(opportunity, apiKey);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('API Error in rescue-risk route:', error);
    return NextResponse.json({ error: 'Failed to analyze risk' }, { status: 500 });
  }
}
