// frontend/src/app/admin/orders/page.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import OrdersClient from './OrdersClient';
import AdminLayout from '../components/AdminLayout';

async function checkAdminAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  try {
    const res = await fetch('http://localhost:4000/api/auth/me', {
      headers: {
        cookie: `access_token=${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      redirect('/admin/login');
    }

    const data = await res.json();
    const user = data.user;

    if (user.role !== 'admin') {
      redirect('/admin/login');
    }

    return user;
  } catch (error) {
    redirect('/admin/login');
  }
}

async function fetchOrders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  const res = await fetch('http://localhost:4000/api/orders', {
    headers: {
      cookie: `access_token=${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    throw new Error('Failed to fetch orders');
  }

  return res.json();
}

export default async function AdminOrdersPage() {
  const user = await checkAdminAccess();
  const orders = await fetchOrders();

  return (
      <OrdersClient orders={orders} user={user} />
  );
}