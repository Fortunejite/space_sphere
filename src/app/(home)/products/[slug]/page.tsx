'use client';

import { IProduct } from '@/models/Product.model';
import { Stack } from '@mui/material';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProductDetailsPage = () => {
  const { slug } = useParams();

  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${slug}`);
      setProduct(data);
    };

    fetchProduct();
  }, [slug]);

  if (!product) return null;

  return <Stack>{JSON.stringify(product)}</Stack>;
};

export default ProductDetailsPage;
