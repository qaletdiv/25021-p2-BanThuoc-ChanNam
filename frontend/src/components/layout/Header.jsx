// src/components/layout/Header.jsx
import Link from 'next/link';

export default function Header({ user }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-bold text-blue-800">PharmaHub</Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-gray-700 hover:text-blue-800">Trang chủ</Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-800">Sản phẩm</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-800">Liên hệ</Link>

            {user ? (
              <>
                <Link href="/my-account" className="text-gray-700 hover:text-blue-800">
                  Tài khoản của tôi ({user.name})
                </Link>
                <Link href="/logout" className="text-gray-700 hover:text-blue-800">Đăng xuất</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-800">Đăng nhập</Link>
                <Link href="/register" className="bg-blue-800 text-white px-3 py-1.5 rounded-md hover:bg-blue-700">
                  Đăng ký
                </Link>
              </>
            )}

            <Link href="/cart" className="text-gray-700 hover:text-blue-800">🛒</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}