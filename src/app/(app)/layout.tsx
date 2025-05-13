
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, FileText, Shield, LayoutDashboard } from 'lucide-react';

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  let pageTitle = 'Content Guardian';
  if (pathname === '/') {
    pageTitle = 'Moderation Tools';
  } else if (pathname === '/documentation') {
    pageTitle = 'API Documentation';
  } else if (pathname === '/overview') {
    pageTitle = 'Usage Overview';
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" title="Content Guardian Home">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-semibold text-lg group-data-[state=collapsed]:hidden">
              Content Guardian
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/'}
                  tooltip="Moderation Tools"
                >
                  <a>
                    <Home />
                    <span className="group-data-[state=collapsed]:hidden">Moderation Tools</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/overview" passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/overview'}
                  tooltip="Overview"
                >
                  <a>
                    <LayoutDashboard />
                    <span className="group-data-[state=collapsed]:hidden">Overview</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/documentation" passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/documentation'}
                  tooltip="API Documentation"
                >
                  <a>
                    <FileText />
                    <span className="group-data-[state=collapsed]:hidden">API Documentation</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 group-data-[state=collapsed]:p-0">
           <div className="text-xs text-muted-foreground p-2 group-data-[state=collapsed]:hidden">
            &copy; {new Date().getFullYear()} CG
           </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2 md:py-4 mb-4 md:mb-0">
          <div className="md:hidden"> {/* Mobile trigger */}
            <SidebarTrigger />
          </div>
           <h1 className="text-xl md:text-2xl font-semibold flex-1">
            {pageTitle}
          </h1>
        </header>
        <main className="flex-1 p-4 pt-0 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

