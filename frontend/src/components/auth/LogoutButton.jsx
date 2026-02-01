// frontend/src/components/LogoutButton.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout as apiLogout } from '@/lib/auth';

export default function LogoutButton({ className, children = 'Đăng xuất' }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await apiLogout();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Đang xử lý...' : children}
    </button>
  );
}