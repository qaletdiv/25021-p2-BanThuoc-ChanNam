// frontend/src/app/product/[id]/page.js
import { fetchProductById } from '@/lib/api';
import ProductClient from './ProductClient';

export default async function ProductPage({ params }) {
  const { id } = await params;
  let product = null;
  let error = null;

  try {
    product = await fetchProductById(parseInt(id));
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl text-red-600">Lỗi: {error}</h1>
        <a href="/products" className="text-blue-600 hover:underline">← Quay lại danh sách</a>
      </div>
    );
  }

  return <ProductClient product={product} />;
}