import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { moderateText, type ModerateTextInput, type ModerateTextOutput } from '@/ai/flows/moderate-text';

const RequestBodySchema = z.object({
  text: z.string().min(1, 'Text cannot be empty.'), 
});

export async function POST(request: NextRequest) {
  let requestBody;
  try {
    requestBody = await request.json();
  } catch (e: any) {
    console.error('API Error (moderate-text): Failed to parse JSON body.', e.message);
    let errorMessage = 'Invalid JSON input. Ensure Content-Type is application/json and body is valid JSON.';
    if (e.message.includes('Unexpected end of JSON input')) {
      errorMessage = 'Request body is empty or malformed (unexpected end of JSON). Ensure Content-Type is application/json.';
    } else if (e.message.toLowerCase().includes('invalid json') || e.message.toLowerCase().includes('unexpected token')) {
      errorMessage = `Request body contains invalid JSON: ${e.message}. Ensure Content-Type is application/json.`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  const validation = RequestBodySchema.safeParse(requestBody);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ') },
      { status: 400 }
    );
  }

  const { text } = validation.data;

  try {
    const input: ModerateTextInput = { text };
    const result: ModerateTextOutput = await moderateText(input);
    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    console.error('Text moderation API error (after parsing):', e);
    if (e instanceof z.ZodError) { 
      return NextResponse.json(
        { error: 'Invalid input for text moderation: ' + e.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ') },
        { status: 400 }
      );
    }
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during text moderation.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
