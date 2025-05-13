
/**
 * @fileOverview Client-side SDK for interacting with the Content Guardian API.
 *
 * - ContentGuardianSDK - Class to interact with the API.
 * - TextModerationResult - Type for text moderation API response.
 * - ImageModerationResult - Type for image moderation API response.
 * - ModerationError - Type for API error response.
 */

export interface TextModerationResult {
  isHateSpeech: boolean;
  confidenceScore: number;
}

export interface ImageModerationResult {
  isNsfw: boolean;
  confidence: number;
}

export interface ModerationError {
  error: string;
}

export class ContentGuardianSDK {
  private baseServerUrl: string;

  /**
   * Initializes the SDK.
   * @param baseServerUrl The base URL of the server hosting the Content Guardian API (e.g., 'http://localhost:9002' or '' for same-origin).
   *                      Defaults to an empty string, assuming API calls are to the same origin.
   */
  constructor(baseServerUrl: string = '') {
    this.baseServerUrl = baseServerUrl.endsWith('/') ? baseServerUrl.slice(0, -1) : baseServerUrl;
  }

  private async _request<T>(apiPath: string, body: unknown): Promise<T> {
    const fullUrl = `${this.baseServerUrl}${apiPath}`; // apiPath will be like '/api/moderate-text'
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorData: ModerationError;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          // If parsing error JSON fails, use status text
          throw new Error(response.statusText || `API request failed with status ${response.status} at ${fullUrl}`);
        }
        throw new Error(errorData.error || `API request failed with status ${response.status} at ${fullUrl}`);
      }
      return await response.json() as T;
    } catch (error) {
      if (error instanceof Error) {
        // Prepend API path to the error message if it's not already there to give context
        if (!error.message.includes(apiPath) && !error.message.includes(fullUrl)) {
            throw new Error(`Error during request to ${apiPath}: ${error.message}`);
        }
        throw error;
      }
      throw new Error(`An unexpected error occurred during the API request to ${apiPath}.`);
    }
  }

  /**
   * Moderates text for potential hate speech.
   * @param text The text content to be analyzed.
   * @returns A promise that resolves with the moderation result.
   * @throws Error if the text is empty or if the API request fails.
   */
  async moderateText(text: string): Promise<TextModerationResult> {
    if (!text || text.trim() === '') {
      throw new Error('Text input for moderation cannot be empty.');
    }
    return this._request<TextModerationResult>('/api/moderate-text', { text });
  }

  /**
   * Moderates an image for NSFW content.
   * @param imageDataUri The image encoded as a Base64 data URI.
   * @returns A promise that resolves with the moderation result.
   * @throws Error if the imageDataUri is invalid or if the API request fails.
   */
  async moderateImage(imageDataUri: string): Promise<ImageModerationResult> {
    if (!imageDataUri || !imageDataUri.startsWith('data:image/')) {
      throw new Error('Invalid imageDataUri format. Expected "data:image/...;base64,..."');
    }
    // Basic check for base64 content, though not exhaustive
    if (!imageDataUri.includes(';base64,')) {
        throw new Error('imageDataUri missing ";base64," part.');
    }
    return this._request<ImageModerationResult>('/api/moderate-image', { imageDataUri });
  }
}
