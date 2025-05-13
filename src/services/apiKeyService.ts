// For a production application, API keys should be stored securely in a database.
// This in-memory solution is for demonstration purposes only.
'use server';

import crypto from 'crypto';

const validApiKeys = new Set<string>();

// Pre-populate with a default key for testing if needed, or remove if keys should only be generated via UI.
// validApiKeys.add('test-api-key-123');

/**
 * Generates a cryptographically secure API key.
 * @returns A new API key string.
 */
function generateApiKey(): string {
  return crypto.randomBytes(24).toString('hex');
}

/**
 * Generates a new API key, stores it (in-memory), and returns it.
 * @returns The newly generated and stored API key.
 */
export async function generateAndStoreApiKey(): Promise<string> {
  const newKey = generateApiKey();
  validApiKeys.add(newKey);
  console.log(`Generated new API key: ${newKey}. Total keys: ${validApiKeys.size}`);
  return newKey;
}

/**
 * Validates if a given API key is present in the set of valid keys.
 * @param apiKey The API key to validate.
 * @returns True if the API key is valid, false otherwise.
 */
export async function validateApiKey(apiKey: string | undefined | null): Promise<boolean> {
  if (!apiKey) {
    return false;
  }
  return validApiKeys.has(apiKey);
}

/**
 * Retrieves all currently stored API keys.
 * WARNING: This is for demonstration/debugging and should not be exposed in a real application.
 * @returns A list of all API keys.
 */
export async function getAllApiKeys_INTERNAL_USE_ONLY(): Promise<string[]> {
  return Array.from(validApiKeys);
}
