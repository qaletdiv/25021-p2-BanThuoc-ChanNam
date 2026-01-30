// Base API URL - có thể đổi thành biến môi trường
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Hàm fetch với authentication
export async function authFetch(url, options = {}) {
  const config = {
    credentials: 'include', // Quan trọng: gửi cookie theo request
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Nếu URL không bắt đầu bằng http, thêm API_URL
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  
  return fetch(fullUrl, config);
}

// Hàm kiểm tra đăng nhập và lấy thông tin user
export async function checkAuth() {
  try {
    const res = await authFetch(`${API_URL}/auth/me`);
    
    if (res.ok) {
      const data = await res.json();
      
      // Kiểm tra cả hai định dạng response
      if (data.authenticated && data.user) {
        return data.user;
      }
      
      // Hoặc định dạng trực tiếp { user: {...} }
      if (data.user) {
        return data.user;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

// Hàm login
export async function login(email, password) {
  try {
    const res = await authFetch(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      return {
        success: true,
        user: data.user,
        message: data.message || 'Đăng nhập thành công',
      };
    } else {
      return {
        success: false,
        message: data.message || 'Đăng nhập thất bại',
      };
    }
  } catch (error) {
    console.error('Login failed:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến server',
    };
  }
}

// Hàm đăng ký
export async function register(userData) {
  try {
    const res = await authFetch(`${API_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.ok) {
      return {
        success: true,
        user: data.user,
        message: data.message || 'Đăng ký thành công',
      };
    } else {
      return {
        success: false,
        message: data.message || 'Đăng ký thất bại',
      };
    }
  } catch (error) {
    console.error('Register failed:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến server',
    };
  }
}

// Hàm logout
export async function logout() {
  try {
    const res = await authFetch(`${API_URL}/auth/logout`, {
      method: 'POST',
    });

    if (res.ok) {
      return {
        success: true,
        message: 'Đăng xuất thành công',
      };
    }
    
    return {
      success: false,
      message: 'Đăng xuất thất bại',
    };
  } catch (error) {
    console.error('Logout failed:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến server',
    };
  }
}

// Hàm cập nhật thông tin user
export async function updateUser(userId, userData) {
  try {
    const res = await authFetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.ok) {
      return {
        success: true,
        user: data.user,
        message: data.message || 'Cập nhật thành công',
      };
    } else {
      return {
        success: false,
        message: data.message || 'Cập nhật thất bại',
      };
    }
  } catch (error) {
    console.error('Update user failed:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến server',
    };
  }
}

// Hàm đổi mật khẩu
export async function changePassword(currentPassword, newPassword) {
  try {
    const res = await authFetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      return {
        success: true,
        message: data.message || 'Đổi mật khẩu thành công',
      };
    } else {
      return {
        success: false,
        message: data.message || 'Đổi mật khẩu thất bại',
      };
    }
  } catch (error) {
    console.error('Change password failed:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến server',
    };
  }
}

// Hàm kiểm tra role
export function hasRole(user, requiredRole) {
  if (!user || !user.role) return false;
  
  // Nếu requiredRole là array, kiểm tra bất kỳ role nào
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }
  
  return user.role === requiredRole;
}

// Hàm kiểm tra quyền admin
export function isAdmin(user) {
  return hasRole(user, 'admin');
}

// Hàm refresh token (nếu có)
export async function refreshToken() {
  try {
    const res = await authFetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
    });

    const data = await res.json();

    if (res.ok) {
      return {
        success: true,
        token: data.token,
        message: 'Token refreshed successfully',
      };
    } else {
      return {
        success: false,
        message: data.message || 'Refresh token failed',
      };
    }
  } catch (error) {
    console.error('Refresh token failed:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến server',
    };
  }
}

// Hàm lấy thông tin user từ server (force fresh data)
export async function fetchUserProfile() {
  try {
    const res = await authFetch(`${API_URL}/auth/me`);
    
    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        user: data.user || data,
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy thông tin người dùng',
    };
  } catch (error) {
    console.error('Fetch user profile failed:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến server',
    };
  }
}

// Helper để xử lý lỗi auth
export function handleAuthError(error) {
  console.error('Authentication error:', error);
  
  // Có thể thêm logic redirect hoặc clear storage ở đây
  if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
    // Tự động logout nếu token hết hạn
    logout();
    window.location.href = '/login?session=expired';
  }
  
  return {
    success: false,
    message: error.message || 'Lỗi xác thực',
  };
}