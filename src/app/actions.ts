
'use server';

import { moderateText, type ModerateTextInput, type ModerateTextOutput } from '@/ai/flows/moderate-text';
import { moderateImage, type ModerateImageInput, type ModerateImageOutput } from '@/ai/flows/moderate-image';
import { generateAndStoreApiKey } from '@/services/apiKeyService';
import { z } from 'zod';
// Firebase client SDK auth instance and methods like createUserWithEmailAndPassword, signInWithEmailAndPassword are no longer used here for direct email/password auth.
// Google Sign-In will be handled client-side.

export interface TextModerationState {
  result?: ModerateTextOutput;
  error?: string | null;
  timestamp?: number; 
}

export interface ImageModerationState {
  result?: ModerateImageOutput;
  error?: string | null;
  timestamp?: number;
}

export interface ApiKeyGenerationState {
  apiKey?: string;
  error?: string | null;
  timestamp?: number;
}

// Removed AuthState as it was tied to email/password form actions

const textSchema = z.object({
  textToModerate: z.string().min(1, 'Text cannot be empty.').max(5000, 'Text is too long.'),
});

const imageSchema = z.object({
  imageFile: z.instanceof(File).refine(file => file.size > 0, 'Image file is required.')
    .refine(file => file.size < 10 * 1024 * 1024, 'Image file size should be less than 10MB.')
    .refine(file => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type), 'Invalid image format. Supported formats: JPEG, PNG, WebP, GIF.'),
});

// Removed signUpSchema and loginSchema

async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function handleTextModeration(
  prevState: TextModerationState,
  formData: FormData
): Promise<TextModerationState> {
  const rawText = formData.get('textToModerate');
  
  const validation = textSchema.safeParse({ textToModerate: rawText });

  if (!validation.success) {
    return { error: validation.error.errors.map(e => e.message).join(', '), timestamp: Date.now() };
  }

  const { textToModerate } = validation.data;

  try {
    const input: ModerateTextInput = { text: textToModerate };
    const result = await moderateText(input);
    return { result, error: null, timestamp: Date.now() };
  } catch (e) {
    console.error('Text moderation error:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during text moderation.';
    return { error: errorMessage, timestamp: Date.now() };
  }
}

export async function handleImageModeration(
  prevState: ImageModerationState,
  formData: FormData
): Promise<ImageModerationState> {
  const imageFile = formData.get('imageFile') as File | null;

  const validation = imageSchema.safeParse({ imageFile });
  if (!validation.success || !imageFile) { 
     return { error: validation.error?.errors.map(e => e.message).join(', ') || "Invalid image file.", timestamp: Date.now() };
  }
  
  const validatedImageFile = validation.data.imageFile;

  try {
    const imageDataUri = await fileToDataUri(validatedImageFile);
    const input: ModerateImageInput = { imageDataUri };
    const result = await moderateImage(input);
    return { result, error: null, timestamp: Date.now() };
  } catch (e) {
    console.error('Image moderation error:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during image moderation.';
    return { error: errorMessage, timestamp: Date.now() };
  }
}

export async function handleGenerateApiKey(
  prevState: ApiKeyGenerationState,
  formData: FormData
): Promise<ApiKeyGenerationState> {
  try {
    const apiKey = await generateAndStoreApiKey();
    return { apiKey, error: null, timestamp: Date.now() };
  } catch (e) {
    console.error('API Key generation error:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during API key generation.';
    return { error: errorMessage, timestamp: Date.now() };
  }
}

// Removed handleSignUp and handleLogin server actions
