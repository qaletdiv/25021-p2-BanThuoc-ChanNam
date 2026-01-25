import { cookies } from 'next/headers';
import CartClient from './CartClient';

async function fetchCartServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) {
    throw new Error('Unauthorized');
  }
  
  const res = await fetch('http://localhost:4000/api/cart', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    throw new Error('Failed to fetch cart');
  }
  
  return res.json();
}

export default async function CartPage() {
  try {
    const cartItems = await fetchCartServer();
    return <CartClient initialCartItems={cartItems} />;
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl text-red-600">Vui lòng đăng nhập để xem giỏ hàng</h1>
        <a href="/login" className="text-blue-600 hover:underline">
          Đăng nhập ngay →
        </a>
      </div>
    );
  }
}