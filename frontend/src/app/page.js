// frontend/src/app/page.js
import { fetchProducts, fetchCategories } from '@/lib/api';

async function HomePage() {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories()
  ]);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-green-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Nhà thuốc trực tuyến uy tín</h1>
          <p className="text-xl mb-6">Cung cấp thuốc chất lượng cao, giao hàng nhanh chóng, tư vấn chuyên nghiệp 24/7</p>
          <button className="bg-white text-green-600 px-6 py-3 rounded font-bold hover:bg-gray-100">
            Khám phá ngay
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Sản phẩm nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const price = product.units?.[0]?.price || 0;
              return (
                <div key={product.id} className="bg-white rounded-lg shadow p-4">
                  <img
                    src={product.image || '/images/no-image.png'}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-green-600 font-bold mt-2">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                  </p>
                  <a
                    href={`/product/${product.id}`}
                    className="mt-3 inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Xem chi tiết
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  💊
                </div>
                <h3 className="font-bold text-lg">{category.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{category.description}</p>
                <a
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  Xem tất cả →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;