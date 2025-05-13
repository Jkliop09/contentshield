
'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { handleLogin, type AuthState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from '@/components/submit-button';
import { useAuth } from '@/contexts/auth-context'; // To update user state after successful server action

const initialState: AuthState = {
  message: undefined,
  error: null,
  success: false,
  timestamp: undefined,
};

export default function LoginPage() {
  const [state, formAction] = useActionState(handleLogin, initialState);
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useAuth(); // Get setUser from context

  useEffect(() => {
    if (state?.timestamp) { // Check if state has been updated
      if (state.error) {
        toast({
          title: 'Login Failed',
          description: state.error,
          variant: 'destructive',
        });
      } else if (state.success && state.message) {
        toast({
          title: 'Login Successful',
          description: state.message,
        });
        // The AuthProvider's onAuthStateChanged will handle setting the user
        // and redirecting if necessary, or we can redirect here.
        router.push('/'); 
      }
    }
  }, [state, router, toast, setUser]);

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Welcome Back!</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account.
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
          <SubmitButton className="w-full text-lg py-3" loadingText="Logging In...">
            Login
          </SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
         <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/signup">Sign up</Link>
            </Button>
          </p>
      </CardFooter>
    </Card>
  );
}
