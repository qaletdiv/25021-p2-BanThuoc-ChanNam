// frontend/src/lib/cart.js
import { authFetch } from './auth';

export async function fetchCart() {
  const res = await authFetch('http://localhost:4000/api/cart');
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to fetch cart');
  }
  return res.json();
}

export async function updateCartItem(id, quantity) {
  const res = await authFetch(`http://localhost:4000/api/cart/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) {
    throw new Error('Failed to update cart item');
  }
  return res.json();
}

export async function removeCartItem(id) {
  const res = await authFetch(`http://localhost:4000/api/cart/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to remove cart item');
  }
  return res.json();
}

// Thêm hàm để thêm sản phẩm vào giỏ (sử dụng trong ProductClient)
export async function addToCart(productId, unit, quantity, price) {
  const res = await authFetch('http://localhost:4000/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, unit, quantity, price }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to add to cart');
  }
  return res.json();
}

// Hàm xóa toàn bộ giỏ hàng (dùng sau khi đặt hàng thành công)
export async function clearCart() {
  const res = await authFetch('http://localhost:4000/api/cart', {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to clear cart');
  }
  return res.json();
}