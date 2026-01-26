// frontend/src/app/logout/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout as apiLogout } from '@/lib/auth';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      await apiLogout();
      router.push('/');
    };

    doLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Đang đăng xuất...
    </div>
  );
}