'use client';

import { clientErrorHandler } from '@/lib/errorHandler';
import { formatNumber } from '@/lib/utils';
import { IProduct } from '@/models/Product.model';
import {
  Box,
  Breadcrumbs,
  Grid,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProductDetailsPage = () => {
  const { slug } = useParams();

  const [product, setProduct] = useState<IProduct | null>({} as IProduct);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${slug}`);
        setProduct(data);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 404)
          setProduct(null);
        console.error(clientErrorHandler(e));
      }
    };

    fetchProduct();
  }, [slug]);

  if (!product) return notFound();

  if (!product.name) return null;

  const avgRatings =
    product.reviews.reduce(
      (acc, item) => (item.rating ? item.rating + acc : acc),
      0,
    ) / product.reviews.length;

  return (
    <Stack p={2} gap={2}>
      <Breadcrumbs>
        <Link href='/'>Home</Link>
        <Link href='/products'>Products</Link>
        <Typography>{product.name}</Typography>
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Box
            bgcolor={'background.paper'}
            sx={{
              position: 'relative',
              height: 'calc(100vh - 64px)',
              width: 'auto',
            }}
          >
            <Image
              src={product.mainPic}
              alt={product.name}
              fill
              objectFit='contain'
            />
          </Box>
        </Grid>
        <Grid size={6}>
          <Typography variant='h4'>{product.name}</Typography>
          <Stack direction={'row'} spacing={4}>
            {product.stock > 0 ? (
              <Typography variant='body1' color={'success'}>
                In Stock
              </Typography>
            ) : (
              <Typography variant='body1' color={'error'}>
                Out Stock
              </Typography>
            )}

            <Rating precision={0.5} value={avgRatings} size='small' readOnly />
            <Typography variant='body2'>
              {product.reviews.length} Reviews
            </Typography>
          </Stack>
          {product.discount > 0 ? (
            <Stack direction={'row'} spacing={1} alignItems={'end'}>
              <Typography
                variant='body1'
                sx={{ textDecoration: 'line-through' }}
              >
                ₦{formatNumber(product.price.toFixed(0))}
              </Typography>

              <Typography variant='h6' component='p' color='secondary'>
                ₦
                {formatNumber(
                  (
                    product.price -
                    (product.discount / 100) * product.price
                  ).toFixed(0),
                )}
              </Typography>
              <Typography> | You Save</Typography>
              <Typography color='secondary'>
                ₦{formatNumber(((product.discount / 100) * product.price).toFixed(0))} (
                {product.discount}%)
              </Typography>
            </Stack>
          ) : (
            <Stack direction={'row'}>
              <Typography variant='h6'>
                ₦{formatNumber(product.price.toFixed(0))}
              </Typography>
            </Stack>
          )}
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ProductDetailsPage;
