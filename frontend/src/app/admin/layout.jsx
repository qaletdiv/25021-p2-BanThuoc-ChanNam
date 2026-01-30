'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from './components/AdminLayout';

export default function AdminRootLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (loading) return;

      // Nếu không có user hoặc loading, đợi
      if (!user && !loading) {
        router.push('/login');
        return;
      }

      // Nếu có user nhưng không phải admin
      if (user && user.role !== 'admin') {
        router.push('/');
        return;
      }

      // Nếu là admin, cho phép hiển thị
      if (user?.role === 'admin') {
        setIsAuthorized(true);
      }

      setIsChecking(false);
    };

    checkAuthorization();
  }, [user, loading, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  // Xác định active tab dựa trên route
  const getActiveTab = () => {
    const pathname = window.location.pathname;
    if (pathname.includes('/admin/orders')) return 'orders';
    return 'dashboard';
  };

  return (
    <AdminLayout activeTab={getActiveTab()}>
      {children}
    </AdminLayout>
  );
}