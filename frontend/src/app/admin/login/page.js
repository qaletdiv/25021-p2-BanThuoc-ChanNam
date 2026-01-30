// frontend/src/app/admin/login/page.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminLoginClient from './AdminLoginClient';

// Không gọi API trong server component để tránh loop
export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  // Nếu có token, kiểm tra qua client-side
  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Nếu không có token, hiển thị form đăng nhập
  return <AdminLoginClient />;
}