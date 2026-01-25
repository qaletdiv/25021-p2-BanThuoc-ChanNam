'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, parseUserFromToken } from '@/lib/auth';
import { setAuthToken, clearAuthToken } from '@/lib/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    checkAuth();
    

    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkAuth = () => {
    const token = getAuthToken();
    if (token) {
      const userData = parseUserFromToken(token);
      setUser(userData);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const login = (token, userData) => {
    setAuthToken(token);
    setUser(userData);
    window.dispatchEvent(new Event('storage'));
  };

  const logout = () => {
    clearAuthToken(); 
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}