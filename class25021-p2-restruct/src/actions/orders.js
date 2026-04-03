// Server Actions for Orders
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Helper to get cookie header
async function getCookieHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? `access_token=${token}` : '';
}

// Get current user orders
export async function getUserOrders() {
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
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

// Get single order
export async function getOrderById(orderId) {
  try {
    const cookie = await getCookieHeader();
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        Cookie: cookie,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return data.order || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return null;
  }
}

// Create order
export async function createOrderAction(formData) {
  try {
    const cookie = await getCookieHeader();

    // Check if user is authenticated first
    const authRes = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Cookie: cookie,
      },
      cache: 'no-store',
    });

    if (!authRes.ok) {
      return { 
        success: false, 
        message: 'Cần đăng nhập để thực hiện thao tác này',
        requiresAuth: true 
      };
    }

    const items = JSON.parse(formData.get('items'));
    const recipientName = formData.get('recipientName');
    const phone = formData.get('phone');
    const address = formData.get('address');
    const paymentMethod = formData.get('paymentMethod');
    const subtotal = parseFloat(formData.get('subtotal'));
    const shippingCost = parseFloat(formData.get('shippingCost'));
    const totalPrice = parseFloat(formData.get('totalPrice'));

    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify({
        items,
        recipientName,
        phone,
        address,
        paymentMethod,
        subtotal,
        shippingCost,
        totalPrice,
      }),
    });

    if (res.ok) {
      const result = await res.json();

      // Clear cart after successful order
      await fetch(`${API_URL}/cart`, {
        method: 'DELETE',
        headers: {
          Cookie: cookie,
        },
      });

      // Revalidate paths to update cart count in header
      revalidatePath('/');
      revalidatePath('/cart');
      revalidatePath('/products');
      revalidatePath('/account/orders');

      redirect(`/checkout/confirm?id=${result.orderId}`);
    }

    const error = await res.json();
    return { success: false, message: error.message || 'Không thể đặt hàng' };
  } catch (error) {
    // Re-throw redirect errors
    if (error?.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Create order failed:', error);
    return { success: false, message: 'Lỗi kết nối server' };
  }
}

// Cancel order
export async function cancelOrderAction(orderId) {
  try {
    const cookie = await getCookieHeader();
    
    // Check if user is authenticated first
    const authRes = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Cookie: cookie,
      },
      cache: 'no-store',
    });

    if (!authRes.ok) {
      return { 
        success: false, 
        message: 'Cần đăng nhập để thực hiện thao tác này',
        requiresAuth: true 
      };
    }
    
    const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        Cookie: cookie,
      },
    });

    if (res.ok) {
      return { success: true };
    }

    const error = await res.json();
    return { success: false, message: error.message };
  } catch (error) {
    console.error('Cancel order failed:', error);
    return { success: false, message: 'Lỗi kết nối server' };
  }
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
