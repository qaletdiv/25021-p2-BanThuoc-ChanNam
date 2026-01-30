'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const router = useRouter();
  const { login, user, isLoading: authLoading } = useAuth();

  // Kiểm tra nếu đã đăng nhập thì chuyển hướng
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/auth/me', {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            // Nếu đã đăng nhập, chuyển hướng theo role
            if (data.user.role === 'admin') {
              router.push('/admin/orders');
            } else {
              router.push('/');
            }
            return;
          }
        }
      } catch (err) {
        console.error('Check auth failed:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user);
        
        // Chuyển hướng theo role
        if (data.user.role === 'admin') {
          router.push('/admin/orders');
        } else {
          router.push('/');
        }
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginMode = () => {
    setIsAdminLogin(!isAdminLogin);
    setError('');
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          {isAdminLogin ? (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdminLogin ? 'Đăng nhập Quản trị' : 'Đăng nhập'}
          </h1>
          <p className="text-gray-600 text-sm">
            {isAdminLogin ? 'Chỉ dành cho quản trị viên' : 'Đăng nhập vào tài khoản của bạn'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isAdminLogin ? 'Email quản trị' : 'Email'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={isAdminLogin ? "admin@pharmahub.vn" : "email@example.com"}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isAdminLogin}
                onChange={toggleLoginMode}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Đăng nhập với tư cách quản trị</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : isAdminLogin
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang đăng nhập...
              </span>
            ) : (
              isAdminLogin ? 'Đăng nhập quản trị' : 'Đăng nhập'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {!isAdminLogin && (
            <div className="mb-4">
              <a href="/register" className="text-blue-600 hover:underline text-sm">
                Chưa có tài khoản? Đăng ký
              </a>
            </div>
          )}
          <div>
            <a href="/" className="text-gray-600 hover:underline text-sm">
              ← Quay lại trang chủ
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {isAdminLogin
              ? 'Vui lòng sử dụng tài khoản quản trị được cấp phép.'
              : 'Sử dụng email và mật khẩu đã đăng ký để đăng nhập.'}
          </p>
        </div>
      </div>
    </div>
  );
}