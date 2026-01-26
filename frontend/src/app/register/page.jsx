// frontend/src/app/register/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; 

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Họ và tên không được để trống.';
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = 'Họ và tên phải có ít nhất 2 ký tự.';
    }

    if (!formData.email) {
      newErrors.email = 'Email không được để trống.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ.';
    }

    if (!formData.phone) {
      newErrors.phone = 'Số điện thoại không được để trống.';
    } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ.';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu và xác nhận mật khẩu không khớp.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setErrors({});
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Auto login sau khi register
        login(data.accessToken, data.user); 
        setSuccess('Đăng ký thành công! Đang chuyển hướng...');
        
        // Reset form
        setFormData({ 
          fullname: '', 
          email: '', 
          phone: '', 
          password: '', 
          confirmPassword: '' 
        });
        
        // Chuyển hướng về trang chủ sau 1.5 giây
        setTimeout(() => {
          router.push('/');
        }, 1500);
        
      } else {
        setErrors({ 
          submit: data.message || 'Đăng ký thất bại. Vui lòng thử lại.' 
        });
      }
    } catch (err) {
      console.error('Register error:', err);
      setErrors({ 
        submit: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-2">Đăng ký tài khoản</h1>
        <p className="text-gray-600 text-center mb-8">Tạo tài khoản mới để mua thuốc trực tuyến</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột trái: Lợi ích */}
          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Lợi ích khi tạo tài khoản</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="font-medium">Theo dõi đơn hàng và lịch sử mua sắm</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="font-medium">Nhận thông báo khuyến mãi sớm</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="font-medium">Lưu danh sách sản phẩm yêu thích</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="font-medium">Hỗ trợ khách hàng ưu tiên</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="font-medium">Đánh giá sản phẩm đã mua</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="font-medium">Lưu nhiều địa chỉ giao hàng</span>
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-2">Ưu đãi đặc biệt</h3>
                <p className="text-blue-700 text-sm">
                  Đăng ký ngay để nhận <span className="font-bold">mã giảm giá 10%</span> cho đơn hàng đầu tiên!
                </p>
              </div>
            </div>
          </div>

          {/* Cột phải: Form */}
          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow">
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.submit && (
                  <div className="bg-red-100 text-red-700 p-3 rounded border border-red-200">
                    <span className="font-medium">Lỗi: </span>{errors.submit}
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-100 text-green-700 p-3 rounded border border-green-200">
                    <span className="font-medium">Thành công: </span>{success}
                  </div>
                )}

                <div>
                  <label htmlFor="fullname" className="block mb-1 font-medium">Họ và tên *</label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg ${errors.fullname ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="Nhập họ và tên"
                    disabled={isSubmitting}
                  />
                  {errors.fullname && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span> {errors.fullname}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block mb-1 font-medium">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="example@email.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-1 font-medium">Số điện thoại *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="0901234567"
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span> {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block mb-1 font-medium">Mật khẩu *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="Ít nhất 6 ký tự"
                    disabled={isSubmitting}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span> {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block mb-1 font-medium">Nhập lại mật khẩu *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="Nhập lại mật khẩu"
                    disabled={isSubmitting}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span> {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* <div className="text-sm text-gray-600">
                  <p>Bằng việc đăng ký, bạn đồng ý với <Link href="/terms" className="text-blue-600 hover:underline">Điều khoản sử dụng</Link> và <Link href="/privacy" className="text-blue-600 hover:underline">Chính sách bảo mật</Link> của chúng tôi.</p>
                </div> */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : 'Đăng ký'}
                </button>

                <div className="text-center pt-4 border-t">
                  <p className="text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link 
                      href="/login" 
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}