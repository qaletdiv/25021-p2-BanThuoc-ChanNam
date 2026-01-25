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
  await authFetch(`http://localhost:4000/api/cart/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  });
}


export async function removeCartItem(id) {
  await authFetch(`http://localhost:4000/api/cart/${id}`, {
    method: 'DELETE'
  });
}

