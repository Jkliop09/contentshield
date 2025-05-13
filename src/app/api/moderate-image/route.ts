import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { moderateImage, type ModerateImageInput, type ModerateImageOutput } from '@/ai/flows/moderate-image';

// This is a basic check for the API layer before calling the Genkit flow.
// The Genkit flow itself will perform more detailed validation of the imageDataUri.
const RequestBodySchema = z.object({
  imageDataUri: z.string().min(1, "imageDataUri cannot be empty."),
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

  const { imageDataUri } = validation.data;

  try {
    const input: ModerateImageInput = { imageDataUri };
    const result: ModerateImageOutput = await moderateImage(input);
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.error('Image moderation API error:', e);
    if (e instanceof z.ZodError) { // Catches ZodError from Genkit flow validation
      return NextResponse.json(
        { error: 'Invalid input for image moderation: ' + e.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ') },
        { status: 400 }
      );
    }
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during image moderation.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
