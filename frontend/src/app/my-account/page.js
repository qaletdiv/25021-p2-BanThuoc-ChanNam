// frontend/src/app/my-account/page.js
import { cookies } from 'next/headers';
import MyAccountClient from './MyAccountClient';

async function fetchUserData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  // Fetch user info
  const userRes = await fetch('http://localhost:4000/api/auth/me', {
    headers: {
      cookie: `access_token=${token}`,
    },
    cache: 'no-store',
  });

  if (!userRes.ok) {
    if (userRes.status === 401) throw new Error('Unauthorized');
    throw new Error('Failed to fetch user');
  }

  const userData = await userRes.json();
  const user = userData.user;

  // Fetch user orders
  const ordersRes = await fetch('http://localhost:4000/api/orders', {
    headers: {
      cookie: `access_token=${token}`,
    },
    cache: 'no-store',
  });

  if (!ordersRes.ok) {
    throw new Error('Failed to fetch orders');
  }

  const orders = await ordersRes.json();

  // Fetch user addresses
  const addressesRes = await fetch('http://localhost:4000/api/addresses', {
    headers: {
      cookie: `access_token=${token}`,
    },
    cache: 'no-store',
  });

  if (!addressesRes.ok) {
    throw new Error('Failed to fetch addresses');
  }

  const addresses = await addressesRes.json();

  return { user, orders, addresses };
}

export default async function MyAccountPage() {
  try {
    const { user, orders, addresses } = await fetchUserData();

    return <MyAccountClient user={user} orders={orders} addresses={addresses} />;
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl text-red-600">Lỗi: {error.message}</h1>
        <a href="/login" className="text-blue-600 hover:underline">← Đăng nhập</a>
      </div>
    );
  }
}