
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, type FirebaseError } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Chrome, Loader2 } from 'lucide-react'; // Using Chrome as a placeholder for Google icon

export function GoogleSignInButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged in AuthProvider will handle user state update
      // and potential redirect if middleware is set up for it.
      // For explicit redirect after successful sign-in:
      router.push('/overview'); 
      toast({
        title: 'Sign In Successful',
        description: 'Welcome to Content Guardian!',
      });
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error('Google Sign-In error:', firebaseError);
      let errorMessage = 'An unknown error occurred during Google Sign-In.';
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup closed. Please try again.';
      } else if (firebaseError.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in cancelled. Please try again.';
      } else if (firebaseError.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Firebase Authentication. Please check your Firebase console settings.';
      }
       else if (firebaseError.code) {
        errorMessage = `Google Sign-In failed: ${firebaseError.message}`;
      }
      toast({
        title: 'Sign In Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSignIn} 
      disabled={isLoading} 
      className="w-full max-w-xs text-lg py-3"
      variant="outline"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Chrome className="mr-2 h-5 w-5" /> // Placeholder for Google icon
      )}
      Sign in with Google
    </Button>
  );
}

