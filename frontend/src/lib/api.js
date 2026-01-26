// frontend/src/lib/api.js
import { authFetch } from './auth';

const API_BASE = 'http://localhost:4000/api';


export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}


export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function fetchCurrentUser() {
  try {
    const res = await authFetch(`${API_BASE}/auth/me`);
    if (!res.ok) {
      if (res.status === 401) return null; 
      throw new Error('Failed to fetch user');
    }
    const data = await res.json();
    return data.authenticated ? data.user : null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null; 
  }
}

export async function fetchCartCount() {
  try {
    const res = await authFetch(`${API_BASE}/cart`);
    if (!res.ok) return 0;
    const cartItems = await res.json();
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  } catch {
    return 0;
  }
}

export async function fetchOrders() {
  const res = await authFetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function fetchOrderById(id) {
  const res = await authFetch(`${API_BASE}/orders/${id}`);
  if (!res.ok) throw new Error('Order not found');
  return res.json();
}

export async function createOrder(orderData) {
  const res = await authFetch(`${API_BASE}/orders`, {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}

export async function cancelOrder(orderId) {
  const res = await authFetch(`${API_BASE}/orders/${orderId}/cancel`, {
    method: 'PUT'
  });
  if (!res.ok) throw new Error('Failed to cancel order');
  return res.json();
}