// frontend/src/app/order-confirmation/page.js
import { cookies } from 'next/headers';
import OrderConfirmationClient from './OrderConfirmationClient';

async function fetchOrder(orderId) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  const res = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
    headers: {
      cookie: `access_token=${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    if (res.status === 404) throw new Error('Order not found');
    throw new Error('Failed to fetch order');
  }

  const data = await res.json();
  return data.order;
}

export default async function OrderConfirmationPage({ searchParams }) {
  const sp = await searchParams;
  const orderId = sp.id;

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl text-red-600">Lỗi: Thiếu mã đơn hàng</h1>
        <a href="/products" className="text-blue-600 hover:underline">← Quay lại trang chủ</a>
      </div>
    );
  }

  try {
    const order = await fetchOrder(orderId);

    return <OrderConfirmationClient order={order} />;
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl text-red-600">Lỗi: {error.message}</h1>
        <a href="/products" className="text-blue-600 hover:underline">← Quay lại trang chủ</a>
      </div>
    );
  }
}