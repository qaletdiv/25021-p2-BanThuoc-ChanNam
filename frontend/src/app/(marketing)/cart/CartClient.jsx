// frontend/src/app/(marketing)/cart/CartClient.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authFetch } from '@/lib/auth';

export default function CartClient() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await authFetch('http://localhost:4000/api/cart');

        if (res.status === 401) {
          // Không có quyền → về login
          router.push('/login');
          return;
        }

        if (!res.ok) throw new Error('Failed to fetch cart');

        const items = await res.json();
        setCartItems(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  if (loading) return <div className="container mx-auto px-4 py-8">Đang tải...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">Lỗi: {error}</div>;

  // Tính toán
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 500000 ? 0 : 25000;
  const totalPrice = subtotal + shippingCost;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handle update/remove functions using authFetch
  const handleUpdateQuantity = async (id, delta) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);
    try {
      await authFetch(`http://localhost:4000/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      });
      // Refresh cart
      const res = await authFetch('http://localhost:4000/api/cart');
      if (res.ok) {
        const items = await res.json();
        setCartItems(items);
      }
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const handleRemoveItem = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await authFetch(`http://localhost:4000/api/cart/${id}`, {
          method: 'DELETE',
        });
        // Refresh cart
        const res = await authFetch('http://localhost:4000/api/cart');
        if (res.ok) {
          const items = await res.json();
          setCartItems(items);
        }
      } catch (err) {
        console.error('Failed to remove item:', err);
      }
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
          </div>
        </div>
      </div>
    </div>
  );
}