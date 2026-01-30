'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Hàm kiểm tra auth với cookie
  const checkAuth = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/me', {
        credentials: 'include', // Quan trọng: gửi cookie
      });

      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Auth check failed:', error);
      return null;
    }
  };

  // Hàm logout API
  const apiLogout = async () => {
    try {
      await fetch('http://localhost:4000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
  };

  // Load user khi component mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await checkAuth();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    
    // Auto-redirect based on role
    if (userData?.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/');
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    router.push('/login');
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  // Check if user has admin role
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateUser,
      isAuthenticated: !!user,
      isAdmin,
      checkAuth // Export thêm để sử dụng ở nơi khác nếu cần
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);