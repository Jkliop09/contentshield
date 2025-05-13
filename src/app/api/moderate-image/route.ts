import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { moderateImage, type ModerateImageInput, type ModerateImageOutput } from '@/ai/flows/moderate-image';

const RequestBodySchema = z.object({
  imageDataUri: z.string().min(1, "imageDataUri cannot be empty."),
});

export async function POST(request: NextRequest) {
  let requestBody;
  try {
    requestBody = await request.json();
  } catch (e: any) {
    console.error('API Error (moderate-image): Failed to parse JSON body.', e.message);
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

  const { imageDataUri } = validation.data;

  try {
    const input: ModerateImageInput = { imageDataUri };
    const result: ModerateImageOutput = await moderateImage(input);
    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    console.error('Image moderation API error (after parsing):', e);
    if (e instanceof z.ZodError) { 
      return NextResponse.json(
        { error: 'Invalid input for image moderation: ' + e.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ') },
        { status: 400 }
      );
    }
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during image moderation.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
