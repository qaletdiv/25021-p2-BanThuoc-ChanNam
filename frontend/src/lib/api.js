// src/lib/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchProducts() {
  const res = await fetch(`${API_BASE_URL}/products`, { cache: 'force-cache' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'force-cache' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}