// src/app/(marketing)/products/page.js
import { fetchProducts, fetchCategories } from '@/lib/api';
import ProductListClient from './ProductListClient';

export default async function ProductListPage({ searchParams }) {
  const sp = await searchParams;
  
  const initialProducts = await fetchProducts();
  const categories = await fetchCategories();

  const category = sp.category || '';
  const minPrice = sp.minPrice ? parseFloat(sp.minPrice) : null;
  const maxPrice = sp.maxPrice ? parseFloat(sp.maxPrice) : null;
  const sort = sp.sort || 'default';
  const search = sp.search || ''; 

  return (
    <ProductListClient
      initialProducts={initialProducts}
      categories={categories}
      initialFilters={{ category, minPrice, maxPrice, search }}
      initialSort={sort}
    />
  );
}