// frontend/src/app/logout/page.js
import { redirect } from 'next/navigation';

export async function GET() {
  // Gọi API logout ở backend để xóa cookie
  await fetch('http://localhost:4000/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  // Redirect về trang chủ
  redirect('/');
}