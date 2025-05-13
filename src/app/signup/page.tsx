
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { GoogleSignInButton } from '@/components/google-sign-in-button';
import { Button } from '@/components/ui/button';

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Sign up or sign in with your Google account to get started with Content Guardian.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <GoogleSignInButton />
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 pt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Button variant="link" asChild className="p-0 h-auto">
            <Link href="/login">Sign In</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
