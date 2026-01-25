'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/auth';

export default function CartClient({ initialCartItems }) {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isLoading, setIsLoading] = useState(false);

  // Tính toán
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 500000 ? 0 : 25000;
  const totalPrice = subtotal + shippingCost;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleUpdateQuantity = async (id, delta) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);
    try {
      await authFetch(`http://localhost:4000/api/cart/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity: newQty })
      });
      refreshCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const handleRemoveItem = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await authFetch(`http://localhost:4000/api/cart/${id}`, {
          method: 'DELETE'
        });
        refreshCart();
      } catch (err) {
        console.error('Failed to remove item:', err);
      }
    }
  };

  const refreshCart = async () => {
    setIsLoading(true);
    try {
      const res = await authFetch('http://localhost:4000/api/cart');
      if (res.ok) {
        const items = await res.json();
        setCartItems(items);
      } else {
        if (res.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
      }
    } catch (err) {
      console.error('Failed to refresh cart');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h1>
        <p className="text-gray-600">Giỏ hàng hiện đang trống.</p>
        <Link href="/products" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn ({totalItems} sản phẩm)</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Danh sách sản phẩm */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow p-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-0">
                <img
                  src={item.productImage || '/images/no-image.png'}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => e.target.src = '/images/no-image.png'}
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p className="text-sm text-gray-600">
                    Đơn vị: {item.unit}
                    {item.productCategory && ` • ${item.productCategory}`}
                  </p>
                  <p className="text-green-600 font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                  </p>
                  {item.productType && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.productType === 'kedon' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {item.productType === 'kedon' ? 'Thuốc kê đơn' : 'Thuốc không kê đơn'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-10 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-800 mt-1 text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính ({totalItems} sản phẩm)</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>
                  {shippingCost === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingCost)}
                </span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-green-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full block mt-6 bg-green-600 text-white text-center py-3 rounded font-bold hover:bg-green-700"
            >
              Tiến hành thanh toán
            </Link>

            <Link
              href="/products"
              className="w-full block mt-3 bg-gray-200 text-gray-800 text-center py-2 rounded hover:bg-gray-300"
            >
              Tiếp tục mua sắm
            </Link>

            {/* Thông báo miễn phí vận chuyển */}
            <div className="mt-6 p-3 bg-green-50 rounded border border-green-200">
              <div className="flex items-center gap-2">
                <span>🚚</span>
                <div>
                  <p className="font-medium text-green-800">
                    {subtotal >= 500000 ? '✅ Miễn phí vận chuyển!' : 'Thêm sản phẩm để được miễn phí vận chuyển'}
                  </p>
                  {subtotal < 500000 && (
                    <p className="text-sm text-green-700">
                      Thêm {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(500000 - subtotal)} để được miễn phí
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}