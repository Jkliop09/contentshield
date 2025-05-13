
'use client';

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CodeBlock } from '@/components/code-block';
import { ContentGuardianSDK } from '@/lib/content-guardian-sdk';
import { Loader2, UploadCloud, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://contentshield.vercel.app/';

export function ApiTester() {
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [testText, setTestText] = useState<string>('');
  const [testImageFile, setTestImageFile] = useState<File | null>(null);
  const [testImagePreview, setTestImagePreview] = useState<string | null>(null);
  
  const [apiRequestDetails, setApiRequestDetails] = useState<string | null>(null);
  const [apiResponseDetails, setApiResponseDetails] = useState<string | null>(null);
  const [apiTestError, setApiTestError] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    // Clean up preview URL when component unmounts or file changes
    return () => {
      if (testImagePreview) {
        URL.revokeObjectURL(testImagePreview);
      }
    };
  }, [testImagePreview]);

  const sdk = new ContentGuardianSDK(API_BASE_URL, apiKeyInput);

  const fileToDataUri = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (testImagePreview) {
      URL.revokeObjectURL(testImagePreview);
    }
    if (file) {
      setTestImageFile(file);
      setTestImagePreview(URL.createObjectURL(file));
    } else {
      setTestImageFile(null);
      setTestImagePreview(null);
    }
  };

  const clearImagePreview = () => {
    if (testImagePreview) {
      URL.revokeObjectURL(testImagePreview);
    }
    setTestImageFile(null);
    setTestImagePreview(null);
    const fileInput = document.getElementById('testImageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const displayRequestDetails = (method: string, endpoint: string, body: object) => {
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': apiKeyInput || 'YOUR_API_KEY_HERE (not provided)',
    };
    const requestData = {
      URL: `${API_BASE_URL.slice(0, -1)}${endpoint}`, // remove trailing slash from base, keep leading slash on endpoint
      Method: method,
      Headers: headers,
      Body: body,
    };
    setApiRequestDetails(JSON.stringify(requestData, null, 2));
  };
  
  const displayResponseDetails = (status: number, data: object) => {
    const responseData = {
      Status: status,
      Body: data,
    };
    setApiResponseDetails(JSON.stringify(responseData, null, 2));
  };

  const handleTestTextApi = async () => {
    if (!apiKeyInput) {
      setApiTestError('Please enter your API Key.');
      toast({ title: 'API Key Missing', description: 'Please enter your API Key to test the endpoint.', variant: 'destructive' });
      return;
    }
    if (!testText.trim()) {
      setApiTestError('Please enter text to moderate.');
      toast({ title: 'Text Missing', description: 'Please enter some text to moderate.', variant: 'destructive' });
      return;
    }

    setIsTesting(true);
    setApiTestError(null);
    setApiRequestDetails(null);
    setApiResponseDetails(null);
    sdk.setApiKey(apiKeyInput); // Ensure SDK has the latest key

    const requestBody = { text: testText };
    displayRequestDetails('POST', '/api/moderate-text', requestBody);

    try {
      const result = await sdk.moderateText(testText);
      displayResponseDetails(200, result);
      toast({ title: 'Text Moderation Successful', description: 'API call completed.' });
    } catch (error: any) {
      setApiTestError(error.message || 'An unknown error occurred.');
      try {
        // Attempt to parse if error.message is a JSON string from API
        const errorJson = JSON.parse(error.message);
        displayResponseDetails(errorJson.status || 500, errorJson);
      } catch (e) {
        // If not JSON, display as simple error
         displayResponseDetails(500, { error: error.message || 'An unknown error occurred.'});
      }
      toast({ title: 'API Call Error', description: error.message || 'An unknown error occurred.', variant: 'destructive' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestImageApi = async () => {
    if (!apiKeyInput) {
      setApiTestError('Please enter your API Key.');
      toast({ title: 'API Key Missing', description: 'Please enter your API Key to test the endpoint.', variant: 'destructive' });
      return;
    }
    if (!testImageFile) {
      setApiTestError('Please select an image file to moderate.');
      toast({ title: 'Image Missing', description: 'Please select an image file.', variant: 'destructive' });
      return;
    }

    setIsTesting(true);
    setApiTestError(null);
    setApiRequestDetails(null);
    setApiResponseDetails(null);
    sdk.setApiKey(apiKeyInput); // Ensure SDK has the latest key

    try {
      const imageDataUri = await fileToDataUri(testImageFile);
      // For display, truncate data URI if too long
      const displayImageDataUri = imageDataUri.length > 100 ? `${imageDataUri.substring(0, 100)}... (truncated)` : imageDataUri;
      const requestBody = { imageDataUri: displayImageDataUri }; // Show truncated in request details
      displayRequestDetails('POST', '/api/moderate-image', requestBody);

      const result = await sdk.moderateImage(imageDataUri); // Send full URI to SDK
      displayResponseDetails(200, result);
      toast({ title: 'Image Moderation Successful', description: 'API call completed.' });
    } catch (error: any) {
      setApiTestError(error.message || 'An unknown error occurred.');
       try {
        const errorJson = JSON.parse(error.message);
        displayResponseDetails(errorJson.status || 500, errorJson);
      } catch (e) {
         displayResponseDetails(500, { error: error.message || 'An unknown error occurred.'});
      }
      toast({ title: 'API Call Error', description: error.message || 'An unknown error occurred.', variant: 'destructive' });
    } finally {
      setIsTesting(false);
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="testerApiKey" className="text-base font-semibold">Your API Key</Label>
        <Input
          id="testerApiKey"
          type="text"
          value={apiKeyInput}
          onChange={(e) => setApiKeyInput(e.target.value)}
          placeholder="Paste your API key here"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          You can generate an API key from the <a href="/#api-key-generator" className="text-primary hover:underline">Moderation Tools page</a>.
        </p>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Text Moderation Test</TabsTrigger>
          <TabsTrigger value="image">Image Moderation Test</TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="mt-4 space-y-4">
          <div>
            <Label htmlFor="testText" className="text-base">Text to Moderate</Label>
            <Textarea
              id="testText"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text for moderation..."
              rows={4}
              className="mt-1"
            />
          </div>
          <Button onClick={handleTestTextApi} disabled={isTesting || !apiKeyInput || !testText.trim()} className="w-full">
            {isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Test Text API
          </Button>
        </TabsContent>
        <TabsContent value="image" className="mt-4 space-y-4">
          <div>
            <Label htmlFor="testImageFile" className="text-base">Image to Moderate</Label>
            <div className="mt-1 flex items-center justify-center w-full">
                <label
                    htmlFor="testImageFile"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
                >
                    {testImagePreview ? (
                        <div className="relative w-full h-full">
                            <Image src={testImagePreview} alt="Preview" layout="fill" objectFit="contain" className="rounded-md" data-ai-hint="uploaded image preview"/>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 bg-background/70 hover:bg-destructive/70 hover:text-destructive-foreground rounded-full h-7 w-7"
                                onClick={(e) => { e.preventDefault(); clearImagePreview(); }}
                                aria-label="Remove image"
                            >
                                <XCircle className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                            <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-1 text-sm text-muted-foreground">
                                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WebP</p>
                        </div>
                    )}
                    <Input id="testImageFile" name="testImageFile" type="file" className="hidden" accept="image/png, image/jpeg, image/gif, image/webp" onChange={handleImageFileChange} />
                </label>
            </div>

          </div>
          <Button onClick={handleTestImageApi} disabled={isTesting || !apiKeyInput || !testImageFile} className="w-full">
            {isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Test Image API
          </Button>
        </TabsContent>
      </Tabs>

      {apiTestError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Test Error</AlertTitle>
          <AlertDescription>{apiTestError}</AlertDescription>
        </Alert>
      )}

      {apiRequestDetails && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Request Details:</h3>
          <CodeBlock title="API Request">{apiRequestDetails}</CodeBlock>
        </div>
      )}

      {apiResponseDetails && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Response Details:</h3>
          <CodeBlock title="API Response">{apiResponseDetails}</CodeBlock>
        </div>
      )}
    </div>
  );
}
