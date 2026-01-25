// frontend/src/app/register/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng gõ
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
        setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
        // Reset form
        setFormData({ fullname: '', email: '', phone: '', password: '', confirmPassword: '' });
        // Chuyển hướng sau 2 giây
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setErrors({ submit: data.message || 'Đăng ký thất bại. Vui lòng thử lại.' });
      }
    } catch (err) {
      setErrors({ submit: 'Không thể kết nối đến server. Vui lòng kiểm tra backend.' });
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
                  <span className="text-green-600 mr-2">•</span>
                  <span>Theo dõi đơn hàng và lịch sử mua sắm</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Nhận thông báo khuyến mãi sớm</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Lưu danh sách sản phẩm yêu thích</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Hỗ trợ khách hàng ưu tiên</span>
                </li>
              </ul>
              <div className="mt-6">
                <img
                  src="https://placehold.co/400x200?text=Khuyến+mãi+đặc+biệt"
                  alt="Khuyến mãi"
                  className="w-full rounded"
                />
              </div>
            </div>
          </div>

          {/* Cột phải: Form */}
          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow">
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.submit && (
                  <div className="bg-red-100 text-red-700 p-3 rounded">{errors.submit}</div>
                )}
                {success && (
                  <div className="bg-green-100 text-green-700 p-3 rounded">{success}</div>
                )}

                <div>
                  <label htmlFor="fullname" className="block mb-1 font-medium">Họ và tên *</label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${errors.fullname ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nhập họ và tên"
                  />
                  {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block mb-1 font-medium">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nhập địa chỉ email"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-1 font-medium">Số điện thoại *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nhập số điện thoại"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block mb-1 font-medium">Mật khẩu *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nhập mật khẩu"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block mb-1 font-medium">Nhập lại mật khẩu *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nhập lại mật khẩu"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 rounded font-bold text-white ${
                    isSubmitting ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>

                <div className="text-center mt-4">
                  <p className="text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
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