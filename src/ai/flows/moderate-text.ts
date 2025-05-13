// src/ai/flows/moderate-text.ts
'use server';

/**
 * @fileOverview Moderates text for hate speech detection.
 *
 * - moderateText - A function that moderates text for hate speech.
 * - ModerateTextInput - The input type for the moderateText function.
 * - ModerateTextOutput - The return type for the moderateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateTextInputSchema = z.object({
  text: z.string().describe('The text to moderate.'),
});

export type ModerateTextInput = z.infer<typeof ModerateTextInputSchema>;

const ModerateTextOutputSchema = z.object({
  isHateSpeech: z.boolean().describe('Whether the text is hate speech.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe('The confidence score of the hate speech detection.'),
});

export type ModerateTextOutput = z.infer<typeof ModerateTextOutputSchema>;

export async function moderateText(input: ModerateTextInput): Promise<ModerateTextOutput> {
  return moderateTextFlow(input);
}

const moderateTextPrompt = ai.definePrompt({
  name: 'moderateTextPrompt',
  input: {schema: ModerateTextInputSchema},
  output: {schema: ModerateTextOutputSchema},
  prompt: `You are an AI content moderator. Determine if the following text is hate speech. Return a boolean value for isHateSpeech and a confidence score between 0 and 1.

Text: {{{text}}}`,
});

const moderateTextFlow = ai.defineFlow(
  {
    name: 'moderateTextFlow',
    inputSchema: ModerateTextInputSchema,
    outputSchema: ModerateTextOutputSchema,
  },
  async input => {
    const {output} = await moderateTextPrompt(input);
    return output!;
  }
);
