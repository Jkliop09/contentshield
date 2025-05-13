
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/firebase'; // This auth is client-side. Middleware needs server-side session check.
// For true server-side protection, you'd use Firebase Admin SDK to verify ID tokens from cookies.
// This is a simplified example that won't work perfectly without proper server-side session management.

// This is a placeholder for how you might get the current user on the server.
// In a real app, this would involve checking a session cookie or token.
async function getCurrentUser(request: NextRequest): Promise<{ id: string } | null> {
  // Example: Check for a custom auth cookie (you'd set this after client-side Firebase login)
  const sessionCookie = request.cookies.get('firebaseSession');
  if (sessionCookie) {
    try {
      // In a real app: verify this token using Firebase Admin SDK
      // const decodedToken = await admin.auth().verifySessionCookie(sessionCookie.value, true);
      // return { id: decodedToken.uid };
      // For this example, we'll assume if cookie exists, user is "logged in" - THIS IS NOT SECURE FOR PRODUCTION
      return { id: 'mock-user-id-from-cookie' }; 
    } catch (error) {
      // Invalid or expired cookie
      return null;
    }
  }
  return null;
}


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const currentUser = await getCurrentUser(request); // Placeholder

  const protectedAppRoutes = ['/', '/overview', '/documentation']; // Add other app routes that need protection
  const authRoutes = ['/login', '/signup'];

  // If user is logged in
  if (currentUser) {
    // If trying to access login/signup page while logged in, redirect to home
    if (authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else { // If user is not logged in
    // If trying to access a protected app route, redirect to login
    if (protectedAppRoutes.some(route => pathname === route || (route === '/' && pathname.startsWith('/')) && !pathname.startsWith('/api') )) {
        // Allow access to root path if it's for static assets or _next
        if (pathname === '/' && (request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.includes('.'))) {
             return NextResponse.next();
        }
        if (pathname !== '/login') { // Avoid redirect loop if already on login
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
  }
  
  // Allow API routes to be accessed if they handle their own auth (e.g. X-API-Key)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except for static assets and API routes (handled separately)
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
