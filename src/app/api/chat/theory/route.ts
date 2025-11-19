import { theoryChatFlow, type TheoryChatInput } from '@/ai/flows/theory-chat';
import { NextResponse } from 'next/server';
import { runFlow } from 'genkit/beta';

export async function POST(req: Request) {
  try {
    const body: TheoryChatInput = await req.json();

    // Basic validation
    if (!body.lessonContext || !body.userQuery) {
        return NextResponse.json({ error: 'Missing lesson context or user query' }, { status: 400 });
    }

    // In a real app, you might add user authentication checks here.

    const result = await runFlow(theoryChatFlow, body);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in theory chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to get a response from the AI tutor.', details: errorMessage }, { status: 500 });
  }
}
