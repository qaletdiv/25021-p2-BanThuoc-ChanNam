//frontend\src\app\admin\components\AdminLayout.jsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children, activeTab = 'orders' }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Kiểm tra nếu user không phải admin
  if (user && user.role !== 'admin') {
    router.push('/');
    return null;
  }

  // Tabs ngang
  const tabs = [
    { id: 'orders', label: '📋 Đơn hàng', href: '/admin/orders' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo và Tabs */}
            <div className="flex items-center">
              <Link href="/admin/orders" className="flex items-center">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">PH</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 hidden md:block">
                  PharmaHub Admin
                </h1>
              </Link>
              
              {/* Tabs ngang */}
              <nav className="ml-8 hidden lg:flex space-x-1">
                {tabs.map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-50 text-red-700 font-medium border border-red-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* User info và logout */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-medium text-sm">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
              
              <div className="relative group">
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Đăng xuất
                </button>

              </div>
            </div>
          </div>
          
          {/* Tabs ngang cho mobile/tablet */}
          <div className="lg:hidden border-t border-gray-200 mt-2 pt-2">
            <nav className="flex space-x-1 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-50 text-red-700 font-medium border border-red-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}