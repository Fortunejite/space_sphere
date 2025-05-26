import { useCallback, useEffect, useState } from 'react';

import axios from 'axios';

import { clientErrorHandler } from '@/lib/errorHandler';
import { IProduct } from '@/models/Product.model';

import GridView from './gridView';
import ListView from './listView';
import GridViewSkeleton from './gridViewSkeleton';
import ListViewSkeleton from './listViewSkeleton';

interface Props {
  query: Record<string, string>;
  limit: number;
  style: 'grid' | 'list';
}

const ProductsView = ({ query, limit, style }: Props) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLast, setIsLast] = useState(false); //TODO: Add infinite scroll

  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setIsLast(false);
  }, [query]);

  const fetchProducts = useCallback(async () => {
    if (isLast) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', limit.toString());
      params.set('page', currentPage.toString());
      Object.entries(query).forEach(([key, value]) => {
        params.set(key, value);
      });

      const { data: products } = await axios.get('/api/products', { params });
      if (products.length < limit) setIsLast(true);
      setProducts((prev) => [...prev, ...products]);
      setCurrentPage((prev) => prev + 1);
    } catch (e) {
      console.error(clientErrorHandler(e));
    } finally {
      setLoading(false);
    }
  }, [query, currentPage, limit, isLast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return style === 'grid' ? (
    loading ? (
      <GridViewSkeleton limit={limit} />
    ) : (
      <GridView products={products} />
    )
  ) : loading ? (
    <ListViewSkeleton limit={limit} />
  ) : (
    <ListView products={products} />
  );
};

export default ProductsView;
