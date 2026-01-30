import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Lấy cookies từ request
  const cookies = request.headers.get('cookie') || '';
  
  // PUBLIC ROUTES - cho phép truy cập không cần đăng nhập
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/products',
    '/products/[id]', // dynamic product detail
    '/about',
    '/contact',
    '/forgot-password',
    '/reset-password',
    '/privacy',
    '/terms',
    '/search',
  ];

  // Kiểm tra nếu là public route
  const isPublicRoute = publicRoutes.some(route => {
    // Route cố định
    if (pathname === route) return true;
    
    // Dynamic routes pattern
    if (route.includes('[id]')) {
      const basePath = route.replace('[id]', '');
      return pathname.startsWith(basePath) && pathname !== basePath;
    }
    
    return false;
  });

  // Kiểm tra static files và API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') || // File extensions
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Nếu là public route, cho phép truy cập
  if (isPublicRoute) {
    return NextResponse.next();
  }

  try {
    // Kiểm tra authentication
    const authResponse = await fetch('http://localhost:4000/api/auth/me', {
      headers: {
        Cookie: cookies,
      },
    });

    const data = authResponse.ok ? await authResponse.json() : null;
    const user = data?.user;
    const isAuthenticated = authResponse.ok && user;

    // 1. ADMIN ROUTES - bảo vệ nghiêm ngặt
    if (pathname.startsWith('/admin')) {
      if (!isAuthenticated) {
        // Chưa đăng nhập → redirect đến login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        loginUrl.searchParams.set('mode', 'admin'); // Thêm mode để biết là login admin
        return NextResponse.redirect(loginUrl);
      }

      // Kiểm tra role admin
      if (user.role !== 'admin') {
        // Không phải admin → về trang chủ với thông báo
        const homeUrl = new URL('/', request.url);
        homeUrl.searchParams.set('error', 'Bạn không có quyền truy cập khu vực quản trị');
        return NextResponse.redirect(homeUrl);
      }

      // Cho phép truy cập admin
      return NextResponse.next();
    }

    // 2. USER PROTECTED ROUTES - cần đăng nhập như user
    const userProtectedRoutes = [
      '/cart',
      '/checkout',
      '/profile',
      '/my-account',
      '/orders',
      '/wishlist',
      '/settings',
      '/dashboard', // dashboard của user (nếu có)
    ];

    const isUserProtectedRoute = userProtectedRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isUserProtectedRoute) {
      if (!isAuthenticated) {
        // Chưa đăng nhập → redirect đến login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Đã đăng nhập nhưng không phải user (là admin) -> cho phép nếu muốn mua hàng
      // (Admin có thể mua hàng như user bình thường)
      if (user.role === 'admin' && pathname === '/checkout') {
        // Admin cũng có thể checkout
        // Kiểm tra giỏ hàng
        const cartRes = await fetch('http://localhost:4000/api/cart', {
          headers: { Cookie: cookies },
        });

        if (cartRes.ok) {
          const cart = await cartRes.json();
          if (!cart || cart.length === 0) {
            // Giỏ hàng trống → về trang sản phẩm
            return NextResponse.redirect(new URL('/products', request.url));
          }
        }
      }

      return NextResponse.next();
    }

    // 3. API ROUTES PROTECTION (nếu có client-side API routes)
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
      // Bảo vệ API routes (trừ auth)
      if (!isAuthenticated) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // 4. CÁC ROUTES KHÁC - cho phép truy cập hoặc redirect
    // Nếu đã đăng nhập, cho phép truy cập
    if (isAuthenticated) {
      return NextResponse.next();
    }

    // Nếu không đăng nhập và không phải public route → về login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);

  } catch (error) {
    console.error('Middleware error:', error);
    
    // Nếu server lỗi, vẫn cho vào public routes
    if (isPublicRoute) {
      return NextResponse.next();
    }
    
    // Redirect đến login với thông báo lỗi
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'server_error');
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match tất cả request paths trừ:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};