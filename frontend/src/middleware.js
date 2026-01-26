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

  // Nếu là route checkout, kiểm tra giỏ hàng có sản phẩm không
  if (request.nextUrl.pathname === '/checkout') {
    const cartRes = await fetch('http://localhost:4000/api/cart', {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (cartRes.ok) {
      const cart = await cartRes.json();
      if (cart.length === 0) {
        // Giỏ trống → chuyển về trang chủ
        return NextResponse.redirect(new URL('/', request.url));
      }
    } else {
      // Không thể kiểm tra giỏ → về login
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout', '/cart/:path*'],
};