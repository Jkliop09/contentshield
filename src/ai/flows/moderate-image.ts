// Use server directive.
'use server';

/**
 * @fileOverview Image moderation flow to detect NSFW content.
 *
 * - moderateImage - Moderates an image for NSFW content.
 * - ModerateImageInput - Input type for the moderateImage function.
 * - ModerateImageOutput - Return type for the moderateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image to moderate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ModerateImageInput = z.infer<typeof ModerateImageInputSchema>;

const ModerateImageOutputSchema = z.object({
  isNsfw: z.boolean().describe('Whether the image is NSFW (Not Safe For Work).'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence score that the image is NSFW, ranging from 0 to 1.'),
});
export type ModerateImageOutput = z.infer<typeof ModerateImageOutputSchema>;

export async function moderateImage(input: ModerateImageInput): Promise<ModerateImageOutput> {
  return moderateImageFlow(input);
}

const moderateImagePrompt = ai.definePrompt({
  name: 'moderateImagePrompt',
  input: {schema: ModerateImageInputSchema},
  output: {schema: ModerateImageOutputSchema},
  prompt: `You are an AI content moderation expert. Analyze the image provided to determine if it contains NSFW (Not Safe For Work) content.

  Respond with a JSON object indicating whether the image is NSFW and a confidence score (0-1) for your assessment.

  Image: {{media url=imageDataUri}}`,
});

const moderateImageFlow = ai.defineFlow(
  {
    name: 'moderateImageFlow',
    inputSchema: ModerateImageInputSchema,
    outputSchema: ModerateImageOutputSchema,
  },
  async input => {
    const {output} = await moderateImagePrompt(input);
    return output!;
  }
);
