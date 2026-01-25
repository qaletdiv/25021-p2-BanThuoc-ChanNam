// frontend/src/app/(marketing)/products/ProductListClient.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductListClient({ 
  initialProducts, 
  categories, 
  initialFilters, 
  initialSort 
}) {
  const router = useRouter();
  
  // State
  const [products, setProducts] = useState(initialProducts);
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    minPrice: initialFilters.minPrice || null,
    maxPrice: initialFilters.maxPrice || null,
    type: initialFilters.type || '',
    search: initialFilters.search || '', 
  });
  const [sort, setSort] = useState(initialSort || 'default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Áp dụng filters và sort
  useEffect(() => {
    let filtered = [...initialProducts];

    // 1. Filter theo search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }

    // 2. Filter theo category
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // 3. Filter theo type (kedon/khongkedon)
    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    // 4. Filter theo khoảng giá
    if (filters.minPrice !== null) {
      filtered = filtered.filter(p => {
        const prices = p.units?.map(u => u.price) || [0];
        const minPrice = Math.min(...prices);
        return minPrice >= filters.minPrice;
      });
    }
    
    if (filters.maxPrice !== null) {
      filtered = filtered.filter(p => {
        const prices = p.units?.map(u => u.price) || [0];
        const minPrice = Math.min(...prices);
        return minPrice <= filters.maxPrice;
      });
    }

    // 5. Sort sản phẩm
    if (sort === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'price-asc') {
      filtered.sort((a, b) => {
        const priceA = Math.min(...(a.units?.map(u => u.price) || [0]));
        const priceB = Math.min(...(b.units?.map(u => u.price) || [0]));
        return priceA - priceB;
      });
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => {
        const priceA = Math.min(...(a.units?.map(u => u.price) || [0]));
        const priceB = Math.min(...(b.units?.map(u => u.price) || [0]));
        return priceB - priceA;
      });
    }

    setProducts(filtered);
    setCurrentPage(1); 
  }, [filters, sort, initialProducts]);


  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice !== null) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice !== null) params.set('maxPrice', filters.maxPrice);
    if (filters.type) params.set('type', filters.type);
    if (sort !== 'default') params.set('sort', sort);

    const queryString = params.toString();
    

    router.replace(`/products${queryString ? '?' + queryString : ''}`, {
      scroll: false 
    });
  }, [filters, sort, router]);

  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };


  const handleClearFilters = () => {
    setFilters({
      category: '',
      minPrice: null,
      maxPrice: null,
      type: '',
      search: '',
    });
    setSort('default');
  };


  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Danh sách sản phẩm</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:w-1/4 bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-lg mb-4">Bộ lọc</h3>

          {/* Search trong sidebar */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Tìm kiếm</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Tìm theo tên thuốc..."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Danh mục */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Danh mục</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Loại thuốc */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Loại thuốc</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="kedon">Thuốc kê đơn</option>
              <option value="khongkedon">Thuốc không kê đơn</option>
            </select>
          </div>

          {/* Khoảng giá */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Khoảng giá</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Từ"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <input
                type="number"
                placeholder="Đến"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>

          {/* Nút xóa bộ lọc */}
          <button
            onClick={handleClearFilters}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded transition-colors"
          >
            Xóa bộ lọc
          </button>
        </aside>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Header với số lượng và sắp xếp */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <p className="text-gray-600">
                Tìm thấy <span className="font-bold text-blue-600">{products.length}</span> sản phẩm
                {filters.search && (
                  <span> cho "<span className="font-semibold">{filters.search}</span>"</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Sắp xếp:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Mặc định</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
              </select>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào.</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map(product => {
                  const price = product.units?.[0]?.price || 0;
                  const minPrice = Math.min(...(product.units?.map(u => u.price) || [0]));
                  
                  return (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="aspect-square overflow-hidden rounded mb-3">
                        <img 
                          src={product.image || '/images/no-image.png'} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.src = '/images/no-image.png'}
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {product.category}
                        </span>
                        {product.type === 'kedon' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            Kê đơn
                          </span>
                        )}
                      </div>
                      <p className="text-green-600 font-bold text-lg mb-3">
                        {new Intl.NumberFormat('vi-VN', { 
                          style: 'currency', 
                          currency: 'VND' 
                        }).format(minPrice)}
                        {product.units?.length > 1 && (
                          <span className="text-gray-500 text-sm ml-1">(từ)</span>
                        )}
                      </p>
                      <Link 
                        href={`/product/${product.id}`}
                        className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      ←
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;

                      if (
                        pageNum === 1 || 
                        pageNum === totalPages || 
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 border rounded ${currentPage === pageNum 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'hover:bg-gray-50'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 || 
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum} className="px-2">...</span>;
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}