
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { GoogleSignInButton } from '@/components/google-sign-in-button';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Sign in with your Google account to access Content Guardian.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <GoogleSignInButton />
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 pt-6">
         <p className="text-sm text-muted-foreground">
            New to Content Guardian?{' '}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/signup">Create an account</Link>
            </Button>
          </p>
      </CardFooter>
    </Card>
  );
}

