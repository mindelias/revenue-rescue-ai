import { NextRequest, NextResponse } from 'next/server';
import { queryDealMemoryAI } from '@/lib/ai/engine';
import { MemoryDocument } from '@/types/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, corpus, apiKey } = body as {
      query: string;
      corpus: MemoryDocument[];
      apiKey?: string;
    };

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const result = await queryDealMemoryAI(query, corpus || [], apiKey);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('API Error in deal-memory route:', error);
    return NextResponse.json({ error: 'Failed to query deal memory' }, { status: 500 });
  }
}
