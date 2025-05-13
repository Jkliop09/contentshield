'use client';

import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateApiKey, type ApiKeyGenerationState } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy, KeyRound, TriangleAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const initialState: ApiKeyGenerationState = {
  apiKey: undefined,
  error: null,
  timestamp: undefined,
};

export function ApiKeyGenerator() {
  const [state, formAction] = useActionState(handleGenerateApiKey, initialState);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (state?.error) {
      toast({
        title: 'Error Generating API Key',
        description: state.error,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  const copyApiKey = () => {
    if (state?.apiKey) {
      navigator.clipboard.writeText(state.apiKey).then(() => {
        setCopied(true);
        toast({
          title: 'API Key Copied!',
          description: 'The API key has been copied to your clipboard.',
        });
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        toast({
          title: 'Copy Failed',
          description: 'Could not copy API key. Please copy it manually.',
          variant: 'destructive',
        });
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
            <KeyRound className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="text-2xl">API Key Management</CardTitle>
                <CardDescription className="mt-1">
                Generate an API key to use with the Content Guardian API.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <SubmitButton className="w-full text-lg py-3" loadingText="Generating Key...">
            Generate New API Key
          </SubmitButton>
        </form>

        {state?.apiKey && state.timestamp && (
          <div className="mt-6 space-y-4">
            <Alert variant="default" className="border-primary">
              <TriangleAlert className="h-5 w-5 text-primary" />
              <AlertTitle className="text-primary">Important: Save Your API Key</AlertTitle>
              <AlertDescription>
                This is the only time your API key will be shown. Please copy it and store it in a safe place.
                If you lose this key, you will need to generate a new one.
              </AlertDescription>
            </Alert>
            <div>
              <Label htmlFor="apiKey" className="text-base">Your New API Key:</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="apiKey"
                  type="text"
                  value={state.apiKey}
                  readOnly
                  className="text-sm bg-muted"
                />
                <Button variant="outline" size="icon" onClick={copyApiKey} aria-label="Copy API Key">
                  {copied ? <KeyRound className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
         <p className="text-xs text-muted-foreground">
            API keys are required to authenticate requests to <code>/api/moderate-text</code> and <code>/api/moderate-image</code>.
          </p>
      </CardFooter>
    </Card>
  );
}
