'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleImageModeration, type ImageModerationState } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import { ModerationResultDisplay } from '@/components/moderation-result-display';
import { UploadCloud, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const initialState: ImageModerationState = {
  result: undefined,
  error: null,
};

export function ImageModerationForm() {
  const [state, formAction] = useFormState(handleImageModeration, initialState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setFileName(file.name);
    } else {
      setPreviewUrl(null);
      setFileName(null);
    }
  };

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  useEffect(() => {
    if (state?.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      });
    }
    if (state?.result) {
      // Optionally, clear form and preview on successful submission
      // clearPreview();
      // formRef.current?.reset(); 
    }
  }, [state, toast]);


  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="imageFile" className="text-base">Upload an image to analyze:</Label>
        <div className="flex items-center justify-center w-full">
            <label
                htmlFor="imageFile"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
            >
                {previewUrl ? (
                    <div className="relative w-full h-full">
                        <Image src={previewUrl} alt="Preview" layout="fill" objectFit="contain" className="rounded-md" data-ai-hint="uploaded image preview"/>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-background/70 hover:bg-destructive/70 hover:text-destructive-foreground rounded-full h-8 w-8"
                            onClick={(e) => { e.preventDefault(); clearPreview(); }}
                            aria-label="Remove image"
                        >
                            <XCircle className="h-5 w-5" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WebP up to 10MB</p>
                    </div>
                )}
                <Input id="imageFile" name="imageFile" type="file" className="hidden" accept="image/png, image/jpeg, image/gif, image/webp" onChange={handleFileChange} ref={fileInputRef} required />
            </label>
        </div>
        {fileName && !previewUrl && <p className="text-sm text-muted-foreground">Selected: {fileName}</p>}
      </div>
      <SubmitButton className="w-full text-lg py-3" disabled={!previewUrl} loadingText="Analyzing Image...">
        Moderate Image
      </SubmitButton>

      {state?.timestamp && ( // Render only if there's a new state update
        <div className="mt-6">
          {state.result && (
            <ModerationResultDisplay
              type="image"
              isHarmful={state.result.isNsfw}
              confidence={state.result.confidence}
              message={state.result.isNsfw ? "The image may contain NSFW content." : "The image appears to be safe."}
            />
          )}
        </div>
      )}
    </form>
  );
}
