// frontend/src/context/AuthContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, parseUserFromToken, setAuthToken, clearAuthToken } from '@/lib/auth'; // Đã có clearAuthToken
import { fetchCurrentUser } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = getAuthToken();
      
      if (token) {
        // Parse từ token để hiển thị nhanh
        const parsedUser = parseUserFromToken(token);
        if (parsedUser) {
          setUser(parsedUser);
        }
        
        // Fetch từ server để xác thực
        try {
          const serverUser = await fetchCurrentUser();
          if (serverUser) {
            setUser(serverUser);
          } else {
            // Token không hợp lệ
            clearAuthToken();
            setUser(null);
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          clearAuthToken();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = (token, userData) => {
    setAuthToken(token);
    setUser(userData);
  };

  const logout = () => {
    clearAuthToken(); // Sử dụng clearAuthToken
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateUser,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);