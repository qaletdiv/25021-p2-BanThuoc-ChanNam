// frontend/src/lib/auth.js

const API_BASE = 'http://localhost:4000/api';

/**
 * Lấy accessToken từ localStorage
 */
export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}

/**
 * Lưu accessToken vào localStorage
 */
export function setAuthToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
}

/**
 * Xóa accessToken - Đổi tên từ removeAuthToken thành clearAuthToken
 */
export function clearAuthToken() {  // Đổi tên hàm này
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
}

// Để backward compatibility, giữ cả removeAuthToken nếu có code cũ đang dùng
export function removeAuthToken() {
  clearAuthToken();
}

/**
 * Tạo header Authorization
 */
export function getAuthHeader() {
  const token = getAuthToken();
  if (token) {
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return { 'Content-Type': 'application/json' };
}

/**
 * Helper gọi API có xác thực
 */
export async function authFetch(url, options = {}) {
  const headers = {
    ...getAuthHeader(),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  return fetch(url, config);
}

/**
 * Kiểm tra user đã đăng nhập chưa
 */
export async function checkAuth() {
  try {
    const res = await authFetch(`${API_BASE}/auth/me`);
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

/**
 * Đăng xuất
 */
export async function logout() {
  try {
    await authFetch(`${API_BASE}/auth/logout`, {
      method: 'POST'
    });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    clearAuthToken(); // Sử dụng clearAuthToken
  }
}

/**
 * Giải mã JWT để lấy thông tin user (chỉ hiển thị)
 */
export function parseUserFromToken(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    
    const bytes = Uint8Array.from(atob(paddedBase64), c => c.charCodeAt(0));
    const decoder = new TextDecoder('utf-8');
    const jsonPayload = decoder.decode(bytes);

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT:', e);
    return null;
  }
}