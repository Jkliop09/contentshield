'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';


interface CodeBlockProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function CodeBlock({ children, className, title }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const copyToClipboard = () => {
    if (typeof children === 'string') {
      navigator.clipboard.writeText(children).then(() => {
        setHasCopied(true);
        toast({ title: "Copied!", description: `${title || 'Code'} copied to clipboard.` });
        setTimeout(() => setHasCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        toast({ title: "Error", description: "Failed to copy to clipboard.", variant: "destructive" });
      });
    }
  };
  
  if (!isMounted) {
    return (
        <div className={cn("bg-muted p-4 rounded-md my-4 shadow", className)}>
            <div className="h-20 animate-pulse bg-muted-foreground/20 rounded-md"></div>
        </div>
    );
  }


  return (
    <div className="relative group my-4">
      {title && <p className="text-sm font-medium text-muted-foreground mb-1 ml-1">{title}</p>}
      <pre className={cn("bg-muted p-4 pl-6 rounded-md overflow-x-auto text-sm shadow", className)}>
        <code>
          {children}
        </code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity data-[copied=true]:opacity-100"
        onClick={copyToClipboard}
        aria-label="Copy code"
        data-copied={hasCopied}
      >
        {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

