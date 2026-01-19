// src/app/layout.js
import './globals.css';
import StoreProvider from './StoreProvider';
import HeaderClient from '@/components/layout/HeaderClient';
import Footer from '@/components/layout/Footer';
import { getCurrentUser } from '@/lib/auth';

export const metadata = {
  title: 'PharmaHub - Nhà thuốc trực tuyến uy tín',
  description: 'Mua thuốc online an toàn, giao hàng nhanh chóng',
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <html lang="vi">
      <body>
        <StoreProvider>
          {/* Truyền user vào Client Component */}
          <HeaderClient user={user} />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}