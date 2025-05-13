import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { moderateText, type ModerateTextInput, type ModerateTextOutput } from '@/ai/flows/moderate-text';

// This is a basic check for the API layer before calling the Genkit flow.
// The Genkit flow itself will perform more detailed validation of the text.
const RequestBodySchema = z.object({
  text: z.string().min(1, 'Text cannot be empty.'), 
});

export async function POST(request: NextRequest) {
  let requestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON input.' }, { status: 400 });
  }

  const validation = RequestBodySchema.safeParse(requestBody);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors.map((e) => e.message).join(', ') },
      { status: 400 }
    );
  }

  const { text } = validation.data;

  try {
    const input: ModerateTextInput = { text };
    const result: ModerateTextOutput = await moderateText(input);
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.error('Text moderation API error:', e);
    if (e instanceof z.ZodError) { // Catches ZodError from Genkit flow validation
      return NextResponse.json(
        { error: 'Invalid input for text moderation: ' + e.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ') },
        { status: 400 }
      );
    }
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during text moderation.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
