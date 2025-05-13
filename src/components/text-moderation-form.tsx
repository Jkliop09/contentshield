'use client';

import { useFormState } from 'react-dom';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { handleTextModeration, type TextModerationState } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import { ModerationResultDisplay } from '@/components/moderation-result-display';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';


const initialState: TextModerationState = {
  result: undefined,
  error: null,
};

export function TextModerationForm() {
  const [state, formAction] = useFormState(handleTextModeration, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      });
    }
    if (state?.result) {
      // Optionally, clear form on successful submission
      // formRef.current?.reset(); 
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="textToModerate" className="text-base">Enter text to analyze:</Label>
        <Textarea
          id="textToModerate"
          name="textToModerate"
          placeholder="Type or paste your text here..."
          rows={6}
          required
          className="resize-none text-base"
        />
      </div>
      <SubmitButton className="w-full text-lg py-3" loadingText="Analyzing Text...">
        Moderate Text
      </SubmitButton>

      {state?.timestamp && ( // Render only if there's a new state update
        <div className="mt-6">
          {state.result && (
            <ModerationResultDisplay
              type="text"
              isHarmful={state.result.isHateSpeech}
              confidence={state.result.confidenceScore}
              message={state.result.isHateSpeech ? "The provided text may contain hate speech." : "The text appears to be safe."}
            />
          )}
        </div>
      )}
    </form>
  );
}
