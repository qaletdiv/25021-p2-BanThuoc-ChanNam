// frontend/src/app/checkout/page.js
import { cookies } from 'next/headers';
import CheckoutClient from './CheckoutClient';

async function fetchCheckoutData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  // Fetch cart
  const cartRes = await fetch('http://localhost:4000/api/cart', {
    headers: {
      cookie: `access_token=${token}`,
    },
    cache: 'no-store',
  });

  if (!cartRes.ok) {
    if (cartRes.status === 401) throw new Error('Unauthorized');
    throw new Error('Failed to fetch cart');
  }

  const cart = await cartRes.json();

  if (cart.length === 0) {
    throw new Error('Cart is empty');
  }

  // Fetch user info
  const userRes = await fetch('http://localhost:4000/api/auth/me', {
    headers: {
      cookie: `access_token=${token}`,
    },
  });

  if (!userRes.ok) {
    throw new Error('Unauthorized');
  }

  const userData = await userRes.json();
  const user = userData.user;

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 500000 ? 0 : 25000;
  const totalPrice = subtotal + shippingCost;

  return { cart, user, totals: { subtotal, shippingCost, totalPrice } };
}

export default async function CheckoutPage() {
  try {
    const { cart, user, totals } = await fetchCheckoutData();

    return (
      <CheckoutClient 
        initialCart={cart} 
        initialUser={user}
        initialTotals={totals}
      />
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl text-red-600">Lỗi: {error.message}</h1>
        {error.message.includes('Unauthorized') && (
          <a href="/login" className="text-blue-600 hover:underline">
            Đăng nhập để tiếp tục
          </a>
        )}
        {error.message.includes('empty') && (
          <a href="/products" className="text-blue-600 hover:underline">
            Tiếp tục mua sắm
          </a>
        )}
      </div>
    );
  }
}