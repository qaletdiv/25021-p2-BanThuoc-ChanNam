// frontend/src/context/AuthContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth, logout as apiLogout } from '@/lib/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
  };

  const logout = () => {
    apiLogout();
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