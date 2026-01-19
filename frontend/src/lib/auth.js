// src/lib/auth.js
export async function getCurrentUser() {
  try {
    const res = await fetch('http://localhost:4000/api/auth/me', {
      credentials: 'include',
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return data.authenticated ? data.user : null;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}