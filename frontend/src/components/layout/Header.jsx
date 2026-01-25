//frontend/src/components/layout/Header.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchCart } from '@/lib/cart'; 
export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const { user, logout } = useAuth();


  useEffect(() => {
    const loadCartCount = async () => {
      if (user) {
        try {
          const items = await fetchCart();
          const total = items.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(total);
        } catch (error) {
          console.error('Failed to load cart:', error);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    loadCartCount();
    
    const interval = setInterval(loadCartCount, 5000);
    
    return () => clearInterval(interval);
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-800">
              PharmaHub
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm thuốc theo tên..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link href="/" className="hover:text-blue-600">
              Trang chủ
            </Link>
            <Link href="/products" className="hover:text-blue-600">
              Sản phẩm
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/my-account" 
                  className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-200"
                >
                  Tài khoản của tôi ({user.name})
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-red-600 hover:text-red-800"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-600">
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-800 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
                >
                  Đăng ký
                </Link>
              </>
            )}
            
            <Link href="/cart" className="relative hover:text-blue-600">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}