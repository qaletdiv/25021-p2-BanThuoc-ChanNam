// frontend/src/app/logout/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {

    localStorage.removeItem('auth_token');

    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Đang đăng xuất...
    </div>
  );
}