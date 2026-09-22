import { NextRequest, NextResponse } from 'next/server';
import { generateProposalSectionsAI } from '@/lib/ai/engine';
import { Opportunity } from '@/types/opportunity';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deal, templateType, apiKey } = body as {
      deal: Opportunity;
      templateType: string;
      apiKey?: string;
    };

    if (!deal) {
      return NextResponse.json({ error: 'Deal data is required' }, { status: 400 });
    }

    const sections = await generateProposalSectionsAI(deal, templateType || 'ENTERPRISE_SaaS', apiKey);
    return NextResponse.json({ success: true, sections });
  } catch (error) {
    console.error('API Error in proposal route:', error);
    return NextResponse.json({ error: 'Failed to generate proposal' }, { status: 500 });
  }
}
