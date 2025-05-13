
'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { handleSignUp, type AuthState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from '@/components/submit-button';

const initialState: AuthState = {
  message: undefined,
  error: null,
  success: false,
  timestamp: undefined,
};

export default function SignUpPage() {
  const [state, formAction] = useActionState(handleSignUp, initialState);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
     if (state?.timestamp) { // Check if state has been updated
      if (state.error) {
        toast({
          title: 'Sign Up Failed',
          description: state.error,
          variant: 'destructive',
        });
      } else if (state.success && state.message) {
        toast({
          title: 'Sign Up Successful',
          description: state.message,
        });
        router.push('/login'); // Redirect to login page after successful sign up
      }
    }
  }, [state, router, toast]);

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">
          Join Content Guardian by filling out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
          </div>
          <SubmitButton className="w-full text-lg py-3" loadingText="Creating Account...">
            Sign Up
          </SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link href="/login">Login</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}

