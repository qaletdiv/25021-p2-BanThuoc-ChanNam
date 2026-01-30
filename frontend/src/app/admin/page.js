// frontend/src/app/admin/page.js
import { redirect } from 'next/navigation';

export default function AdminPage() {
  redirect('/admin/orders');
  return null;
}