// frontend/src/lib/auth.js

export function setAuthToken(token) {
  if (typeof window !== 'undefined') {

    localStorage.setItem('auth_token', token);
    document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
    window.dispatchEvent(new Event('storage'));
  }
}


export function getAuthTokenFromCookie(req) {
  if (typeof window !== 'undefined') {

    return localStorage.getItem('auth_token');
  } else {

    const cookieHeader = req?.headers?.cookie || '';
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    return cookies.auth_token || null;
  }
}


export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    window.dispatchEvent(new Event('storage'));
    document.cookie = 'auth_token=; path=/; max-age=0';
  }
}


export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}


export function getAuthHeader() {
  const token = getAuthToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}


export async function authFetch(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  return fetch(url, config);
}


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