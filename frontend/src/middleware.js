// frontend/src/middleware.js
import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Gọi API kiểm tra đăng nhập
  const res = await fetch('http://localhost:4000/api/auth/me', {
    headers: {
      cookie: request.headers.get('cookie') || '',
    },
  });

  if (res.status !== 200) {
    // Chưa đăng nhập → redirect đến login
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/my-account/:path*', '/cart/:path*', '/checkout/:path*'],
};