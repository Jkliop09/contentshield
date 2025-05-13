
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <Shield className="h-7 w-7" />
          <span className="text-xl font-semibold">Content Guardian</span>
        </Link>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Content Guardian. All rights reserved.
      </footer>
    </div>
  );
}
