// frontend/src/app/product/[id]/ProductClient.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { authFetch } from '@/lib/auth'; // ← Dùng authFetch

export default function ProductClient({ product }) {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('category');

useEffect(() => {
  const fallbackImage = '/images/no-image.png';
  let imgList = [];

  if (Array.isArray(product.images) && product.images.length > 0) {
    imgList = product.images;
  } else if (product.image) {
    imgList = [product.image];
  } else {
    imgList = [fallbackImage];
  }

  setMainImage(imgList[0] || fallbackImage);
}, [product]);

  const selectedUnit = product.units?.[selectedUnitIndex] || {};
  const price = selectedUnit.price || 0;

  const handleThumbnailClick = (img) => {
    const validImg = img && img.trim() !== '' ? img : '/images/no-image.png';
    setMainImage(validImg);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    setMessage('');

    try {
      const res = await authFetch('http://localhost:4000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          unit: selectedUnit.name,
          quantity,
          price,
        }),
      });

      if (res.ok) {
        setMessage('✅ Đã thêm vào giỏ hàng!');
        
        window.dispatchEvent(new Event('cartUpdated'));
        
        setTimeout(() => setMessage(''), 2000);
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.message || 'Không thể thêm vào giỏ hàng'}`);
      }
    } catch (err) {
      setMessage('❌ Lỗi kết nối server');
    } finally {
      setIsAdding(false);
    }
  };

  const getValidImageUrl = (url) => {
    if (!url || url.trim() === '') return '/images/no-image.png';
    return url;
  };

  return (
    <div className="container mx-auto px-4 py-8">

      <nav className="text-sm mb-6">
        <Link href="/" className="text-blue-600 hover:underline">Trang chủ</Link> {'>'}
        <Link href="/products" className="text-blue-600 hover:underline ml-2">Sản phẩm</Link> {'>'}
        <span className="ml-2 text-gray-700">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Hình ảnh */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow p-4">
            <Image
              src={getValidImageUrl(mainImage)}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-auto object-cover rounded"
              onError={(e) => {
                e.target.src = '/images/no-image.png';
              }}
            />
          </div>

          {product.images && Array.isArray(product.images) && product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => {
                const validImg = getValidImageUrl(img);
                return (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(validImg)}
                    className={`flex-shrink-0 w-16 h-16 border-2 rounded ${
                      mainImage === validImg ? 'border-blue-600' : 'border-gray-300'
                    }`}
                  >
                    <Image
                      src={validImg}
                      alt={`${product.name} ${idx + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/images/no-image.png';
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Thông tin */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="mb-4">
            <span className="text-green-600 font-bold text-xl">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
            </span>
            {product.originalPrice && product.originalPrice > price && (
              <span className="ml-2 text-gray-500 line-through">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Chọn đơn vị */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Chọn đơn vị:</label>
            <select
              value={selectedUnitIndex}
              onChange={(e) => setSelectedUnitIndex(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full max-w-xs"
            >
              {product.units?.map((unit, idx) => (
                <option key={idx} value={idx}>
                  {unit.name} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(unit.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Số lượng */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Số lượng:</label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="border rounded-l px-3 py-2 bg-gray-100 hover:bg-gray-200"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border-t border-b py-2"
              />
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="border rounded-r px-3 py-2 bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Nút thêm vào giỏ */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full py-3 rounded font-bold text-white ${
              isAdding ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
          </button>

          {message && (
            <div className={`mt-3 p-2 rounded text-center ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mt-8 border-t pt-6">
            <div className="flex border-b mb-4">
              {[
                { id: 'category', label: 'Danh mục' },
                { id: 'manufacturer', label: 'Nhà sản xuất' },
                { id: 'ingredients', label: 'Thành phần' },
                { id: 'usage', label: 'Công dụng' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 font-medium text-sm border-b-2 mr-2 transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-blue-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[100px]">
              {activeTab === 'category' && (
                <p className="text-gray-700">{product.category || 'Không xác định'}</p>
              )}
              {activeTab === 'manufacturer' && (
                <p className="text-gray-700">{product.manufacturer || 'Thông tin chưa được cung cấp.'}</p>
              )}
              {activeTab === 'ingredients' && (
                <p className="text-gray-700">{product.ingredients || 'Thông tin thành phần chưa được cung cấp.'}</p>
              )}
              {activeTab === 'usage' && (
                <p className="text-gray-700">{product.usage || 'Thông tin công dụng chưa được cung cấp.'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}