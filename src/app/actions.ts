
'use server';

import { moderateText, type ModerateTextInput, type ModerateTextOutput } from '@/ai/flows/moderate-text';
import { moderateImage, type ModerateImageInput, type ModerateImageOutput } from '@/ai/flows/moderate-image';
import { generateAndStoreApiKey } from '@/services/apiKeyService';
import { z } from 'zod';
import { auth } from '@/lib/firebase'; // Firebase Admin SDK should be used here for server-side auth
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; // These are client-side methods

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

export interface AuthState {
  message?: string;
  error?: string | null;
  success?: boolean;
  timestamp?: number;
}


const textSchema = z.object({
  textToModerate: z.string().min(1, 'Text cannot be empty.').max(5000, 'Text is too long.'),
});

const imageSchema = z.object({
  imageFile: z.instanceof(File).refine(file => file.size > 0, 'Image file is required.')
    .refine(file => file.size < 10 * 1024 * 1024, 'Image file size should be less than 10MB.')
    .refine(file => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type), 'Invalid image format. Supported formats: JPEG, PNG, WebP, GIF.'),
});

const signUpSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'],
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password cannot be empty.'),
});


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

// Note: Firebase client SDK methods (createUserWithEmailAndPassword, signInWithEmailAndPassword) 
// are typically called on the client. Using them in server actions is unconventional and might
// not work as expected without proper Firebase Admin SDK setup for managing users server-side.
// For this example, we'll proceed, but in a real app, consider client-side calls or Firebase Admin.

export async function handleSignUp(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const emailValue = formData.get('email') as string;
  const passwordValue = formData.get('password') as string;
  const confirmPasswordValue = formData.get('confirmPassword') as string;

  const validation = signUpSchema.safeParse({ email: emailValue, password: passwordValue, confirmPassword: confirmPasswordValue });

  if (!validation.success) {
    return { error: validation.error.errors.map(e => e.message).join(', '), success: false, timestamp: Date.now() };
  }

  const { email, password } = validation.data;

  try {
    // This is a client-side SDK method. For server actions, you'd typically use Firebase Admin SDK.
    // This will not actually sign the user in on the server session, but create the user in Firebase.
    // Client will need to re-authenticate or handle the user object returned by Firebase on client-side.
    await createUserWithEmailAndPassword(auth, email, password);
    return { message: 'Sign up successful! Please log in.', success: true, timestamp: Date.now() };
  } catch (e: any) {
    console.error('Sign up error (raw object):', e); // Log the full error object

    let detailedErrorMessage = 'An unknown error occurred during sign up.';
    if (e instanceof Error) { // Standard JS Error
      detailedErrorMessage = e.message;
    } else if (e && typeof e.code === 'string' && typeof e.message === 'string') { // Firebase error structure
      detailedErrorMessage = `Firebase Auth Error (${e.code}): ${e.message}`;
    } else if (e && typeof e.message === 'string') { // Other error objects with a message
      detailedErrorMessage = e.message;
    } else if (typeof e === 'string') { // If the error is just a string
      detailedErrorMessage = e;
    }
    // For debugging, include a stringified version if it's an object but not recognized
    else if (typeof e === 'object' && e !== null) {
        try {
            detailedErrorMessage = `Unknown error object: ${JSON.stringify(e)}`;
        } catch (stringifyError) {
            detailedErrorMessage = 'Unknown error object (could not stringify).';
        }
    }
    
    console.error('Sign up error (processed message):', detailedErrorMessage);
    return { error: detailedErrorMessage, success: false, timestamp: Date.now() };
  }
}

export async function handleLogin(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const emailValue = formData.get('email') as string;
  const passwordValue = formData.get('password') as string;

  const validation = loginSchema.safeParse({ email: emailValue, password: passwordValue });

  if (!validation.success) {
    return { error: validation.error.errors.map(e => e.message).join(', '), success: false, timestamp: Date.now() };
  }
  
  const { email, password } = validation.data;

  try {
    // Similar to signUp, this is a client-side SDK method.
    // It won't establish a server session directly via this server action.
    // The client needs to handle the auth state change.
    await signInWithEmailAndPassword(auth, email, password);
    return { message: 'Login successful!', success: true, timestamp: Date.now() };
  } catch (e: any) {
    console.error('Login error (raw object):', e);
    let detailedErrorMessage = 'An unknown error occurred during login.';
     if (e instanceof Error) {
      detailedErrorMessage = e.message;
    } else if (e && typeof e.code === 'string' && typeof e.message === 'string') {
      detailedErrorMessage = `Firebase Auth Error (${e.code}): ${e.message}`;
    } else if (e && typeof e.message === 'string') {
      detailedErrorMessage = e.message;
    } else if (typeof e === 'string') {
      detailedErrorMessage = e;
    } else if (typeof e === 'object' && e !== null) {
        try {
            detailedErrorMessage = `Unknown error object: ${JSON.stringify(e)}`;
        } catch (stringifyError) {
            detailedErrorMessage = 'Unknown error object (could not stringify).';
        }
    }
    console.error('Login error (processed message):', detailedErrorMessage);
    return { error: detailedErrorMessage, success: false, timestamp: Date.now() };
  }
}

