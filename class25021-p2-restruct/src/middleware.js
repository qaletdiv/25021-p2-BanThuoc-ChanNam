import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get cookie from request
  const cookies = request.cookies.get('access_token')?.value;
  const cookieHeader = cookies ? `access_token=${cookies}` : '';

  // Check static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Set pathname as request header so Server Components can read it via headers()
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Public routes (no authentication required)
  const publicRoutes = [
    '/',
    '/home',
    '/login',
    '/register',
    '/products',
    '/admin/login',
  ];

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return response;
  }

  try {
    // Check authentication
    // Handle both cases: API_URL with or without trailing /api
    const authPath = API_URL.endsWith('/api') ? '/auth/me' : '/api/auth/me';
    const authResponse = await fetch(`${API_URL}${authPath}`, {
      headers: { Cookie: cookieHeader },
    });

    const data = authResponse.ok ? await authResponse.json() : null;
    const user = data?.user;
    const isAuthenticated = authResponse.ok && user;

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
      if (!isAuthenticated) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (user.role !== 'admin') {
        const homeUrl = new URL('/', request.url);
        homeUrl.searchParams.set('error', 'Bạn không có quyền truy cập khu vực quản trị');
        return NextResponse.redirect(homeUrl);
      }

      return response;
    }

    // User protected routes - only cart, checkout, account require login
    const userProtectedRoutes = ['/cart', '/checkout', '/account'];
    const isUserProtectedRoute = userProtectedRoutes.some(
      route => pathname === route || pathname.startsWith(route + '/')
    );

    if (isUserProtectedRoute) {
      if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return response;
    }

    // Allow all other routes without authentication
    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    return response;
  }
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|public/).*)',
};
