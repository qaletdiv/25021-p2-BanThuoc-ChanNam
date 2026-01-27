// frontend/src/app/checkout/CheckoutClient.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authFetch } from '@/lib/auth';

export default function CheckoutClient({ initialCart, initialUser, initialTotals }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    recipientName: initialUser.name || '',
    phone: initialUser.phone || '',
    address: '',
    paymentMethod: 'cod', // 'cod' hoặc 'bank_transfer'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.recipientName.trim()) newErrors.recipientName = 'Vui lòng nhập họ tên người nhận.';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại.';
    else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ.';
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ nhận hàng.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        items: initialCart.map(item => ({
          productId: item.productId,
          productName: item.productName,
          unit: item.unit,
          quantity: item.quantity,
          price: item.price,
          image: item.productImage,
        })),
        recipientName: formData.recipientName,
        phone: formData.phone,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        subtotal: initialTotals.subtotal,
        shippingCost: initialTotals.shippingCost,
        totalPrice: initialTotals.totalPrice,
      };

      const res = await authFetch('http://localhost:4000/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const result = await res.json();
        
        // Xóa giỏ hàng sau khi đặt hàng thành công
        await authFetch('http://localhost:4000/api/cart', {
          method: 'DELETE',
        });

        // Hiển thị thông báo thành công
        setShowSuccess(true);
        
        // Chuyển hướng đến xác nhận đơn hàng sau 2 giây
        setTimeout(() => {
          router.push(`/order-confirmation?id=${result.orderId}`);
        }, 2000);
      } else {
        const error = await res.json();
        setErrors({ submit: error.message || 'Không thể đặt hàng' });
      }
    } catch (err) {
      setErrors({ submit: 'Lỗi kết nối server' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Đặt hàng thành công!</h2>
            <p className="text-gray-600 mb-6">Đang chuyển đến trang xác nhận đơn hàng...</p>
            <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto">
              <div className="h-1 bg-green-600 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thông tin thanh toán</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Thông tin giao hàng */}
        <div className="lg:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Họ tên người nhận *</label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg ${errors.recipientName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nhập họ tên người nhận"
                    disabled={isSubmitting}
                  />
                  {errors.recipientName && <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nhập số điện thoại"
                    disabled={isSubmitting}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block mb-1 font-medium">Địa chỉ nhận hàng *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nhập địa chỉ nhận hàng"
                    disabled={isSubmitting}
                  ></textarea>
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="w-4 h-4"
                    disabled={isSubmitting}
                  />
                  <div>
                    <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                    <div className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={formData.paymentMethod === 'bank_transfer'}
                    onChange={handleChange}
                    className="w-4 h-4"
                    disabled={isSubmitting}
                  />
                  <div>
                    <div className="font-medium">Chuyển khoản ngân hàng</div>
                    <div className="text-sm text-gray-600">Chuyển khoản trước khi nhận hàng</div>
                  </div>
                </label>
              </div>

              {formData.paymentMethod === 'bank_transfer' && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-800 mb-2">Thông tin chuyển khoản</h3>
                  <p><strong>Ngân hàng:</strong> Vietcombank</p>
                  <p><strong>Số tài khoản:</strong> 123456789</p>
                  <p><strong>Chủ tài khoản:</strong> PHARMAHUB</p>
                  <p><strong>Nội dung:</strong> THANHTOAN_[Mã đơn hàng]</p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {initialCart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-200">
                  <img
                    src={item.productImage || '/images/no-image.png'}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => e.target.src = '/images/no-image.png'}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-gray-600">{item.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</p>
                    <p className="text-sm text-gray-600">x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính ({initialCart.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(initialTotals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{initialTotals.shippingCost === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(initialTotals.shippingCost)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-green-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(initialTotals.totalPrice)}</span>
              </div>
            </div>

            {errors.submit && (
              <div className="mt-4 bg-red-100 text-red-700 p-3 rounded border border-red-200">
                {errors.submit}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full block mt-6 py-3 rounded font-bold text-white ${
                isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
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
              ) : 'Đặt hàng ngay'}
            </button>

            <Link
              href="/cart"
              className="w-full block mt-3 py-2 text-center rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={(e) => {
                if (isSubmitting) e.preventDefault();
              }}
            >
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}