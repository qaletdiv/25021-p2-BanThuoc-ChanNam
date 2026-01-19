// frontend/src/app/(marketing)/products/ProductListClient.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductListClient({ initialProducts, categories, initialFilters, initialSort }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [filters, setFilters] = useState({
    category: initialFilters.category,
    minPrice: initialFilters.minPrice,
    maxPrice: initialFilters.maxPrice,
    type: '',
  });
  const [sort, setSort] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Apply filters & sort
  useEffect(() => {
    let filtered = [...initialProducts];

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters.minPrice !== null) {
      filtered = filtered.filter(p => {
        const prices = p.units?.map(u => u.price) || [];
        const min = Math.min(...prices);
        return min >= filters.minPrice;
      });
    }
    if (filters.maxPrice !== null) {
      filtered = filtered.filter(p => {
        const prices = p.units?.map(u => u.price) || [];
        const min = Math.min(...prices);
        return min <= filters.maxPrice;
      });
    }

    // Sort
    if (sort === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'price-asc') {
      filtered.sort((a, b) => Math.min(...(a.units?.map(u => u.price) || [0])) - Math.min(...(b.units?.map(u => u.price) || [0])));
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => Math.min(...(b.units?.map(u => u.price) || [0])) - Math.min(...(a.units?.map(u => u.price) || [0])));
    }

    setProducts(filtered);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [filters, sort, initialProducts]);

  // Update URL when filters/sort change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice !== null) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice !== null) params.set('maxPrice', filters.maxPrice);
    if (sort !== 'default') params.set('sort', sort);

    const queryString = params.toString();
    router.push(`/products${queryString ? '?' + queryString : ''}`);
  }, [filters, sort, router]);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Danh sách sản phẩm</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:w-1/4 bg-gray-50 p-4 rounded">
          <h3 className="font-bold mb-4">Bộ lọc</h3>

          <div className="mb-4">
            <label className="block mb-2">Danh mục</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">Tất cả</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Loại thuốc</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">Tất cả</option>
              <option value="kedon">Thuốc kê đơn</option>
              <option value="khongkedon">Thuốc không kê đơn</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Khoảng giá</label>
            <input
              type="number"
              placeholder="Từ"
              value={filters.minPrice || ''}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? parseFloat(e.target.value) : null })}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="number"
              placeholder="Đến"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? parseFloat(e.target.value) : null })}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={() => setFilters({ category: '', minPrice: null, maxPrice: null, type: '' })}
            className="w-full bg-gray-300 py-2 rounded"
          >
            Xóa bộ lọc
          </button>
        </aside>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <div>{products.length} sản phẩm</div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="default">Mặc định</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
              <option value="price-asc">Giá thấp → cao</option>
              <option value="price-desc">Giá cao → thấp</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map(product => {
              const price = product.units?.[0]?.price || 0;
              return (
                <div key={product.id} className="border rounded p-4">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-3" />
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-green-600 font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                  </p>
                  <a href={`/product/${product.id}`} className="text-blue-600 hover:underline mt-2 block">
                    Xem chi tiết
                  </a>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}