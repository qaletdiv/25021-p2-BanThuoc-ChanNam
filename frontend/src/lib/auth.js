// frontend/src/lib/auth.js
export async function authFetch(url, options = {}) {
  const config = {
    credentials: 'include', // ← QUAN TRỌNG: gửi cookie theo request
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  return fetch(url, config);
}

// Hàm kiểm tra đăng nhập
export async function checkAuth() {
  try {
    const res = await authFetch('http://localhost:4000/api/auth/me');
    if (res.ok) {
      const data = await res.json();
      return data.authenticated ? data.user : null;
    }
    return null;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

// Hàm logout
export async function logout() {
  try {
    await authFetch('http://localhost:4000/api/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }
}