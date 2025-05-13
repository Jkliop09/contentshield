
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
  // A more direct way to check auth state might be needed if you're not setting a specific session cookie
  // and relying on Firebase's client-side persistence. However, middleware runs server-side.
  // For now, this simplistic check is a placeholder.
  // If you want to rely on client-side auth status for redirects, that's typically handled in client components using useAuth and useRouter.
  return null;
}


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // This simplified getCurrentUser won't reflect actual Firebase auth state reliably in middleware.
  // For robust server-side auth checks, Firebase Admin SDK + session cookies are recommended.
  // The logic below assumes `currentUser` can somehow be determined server-side.
  // A common pattern is to set an HTTP-only cookie after client-side Firebase login
  // and verify that cookie here using Firebase Admin SDK.

  const currentUser = await getCurrentUser(request); 

  const protectedAppRoutes = ['/', '/overview', '/documentation'];
  const authRoutes = ['/login', '/signup'];

  // If user is logged in (based on our placeholder check)
  if (currentUser) {
    // If trying to access login/signup page while logged in, redirect to overview (dashboard)
    if (authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/overview', request.url));
    }
  } else { // If user is not logged in
    // If trying to access a protected app route, redirect to login
    // Ensure that the root path check correctly distinguishes between the page and static assets.
    const isProtectedRouteAccess = protectedAppRoutes.some(route => {
        if (route === '/') return pathname === '/'; // Exact match for root
        return pathname.startsWith(route); // Match for other protected routes
    });

    if (isProtectedRouteAccess) {
        // Allow access to static assets or _next files even if on a protected path conceptually
        if (request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.includes('.')) {
             return NextResponse.next();
        }
        // Avoid redirect loop if already on login or signup
        if (!authRoutes.includes(pathname)) { 
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
    // Match all routes except for static assets, _next/image, and favicon.ico.
    // API routes are implicitly included here and then specifically allowed if they handle their own auth.
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

