// Server Actions for Admin Orders
'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Helper to get cookie header
async function getCookieHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? `access_token=${token}` : '';
}

// Admin: Get all orders
export async function getAllOrders() {
  try {
    const cookie = await getCookieHeader();
    const res = await fetch(`${API_URL}/orders`, {
      headers: {
        Cookie: cookie,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch all orders:', error);
    return [];
  }
}

// Admin: Update order status
export async function updateOrderStatusAction(orderId, status) {
  try {
    const cookie = await getCookieHeader();
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      const response = await res.json();
      return { success: true, order: response.order };
    }

    const error = await res.json();
    return { success: false, message: error.message };
  } catch (error) {
    console.error('Update order status failed:', error);
    return { success: false, message: 'Lỗi kết nối server' };
  }
}
