'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Paper,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
  Theme,
  Avatar,
  styled,
} from '@mui/material';

import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { clientErrorHandler } from '@/lib/errorHandler';
import { formatNumber, generateURL } from '@/lib/utils';
import { getShopItem, toggleCart, updateCart } from '@/redux/cartSlice';

import { ICategory } from '@/models/Category.model';
import { IProduct } from '@/models/Product.model';
import { IUser } from '@/models/User.model';

interface CustomProduct
  extends Omit<IProduct, 'categories' | 'reviews' | '_id'> {
  _id: string;
  categories: ICategory[];
  reviews: {
    user: IUser;
    rating: number;
    comment?: string;
    createdAt: string | Date;
  }[];
}

const VariantElement = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  padding: theme.spacing(1),
  cursor: 'pointer',
  border: isActive ? `1px solid ${theme.palette.primary.main}` : 'none',
}));

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const shop = useAppSelector((state) => state.shop.shop);
  const cartStatus = useAppSelector((state) => state.cart.status);
  const isToggling = cartStatus === 'loading';

  const [product, setProduct] = useState<CustomProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  const shopId = shop?._id || '';
  const productId = product?._id || '';

  // Get cart item only once productId and shopId are available
  const cartItem = useAppSelector((state) =>
    productId && shopId ? getShopItem(state, shopId, productId) : undefined,
  );

  // Initialize or update selectedVariant when product or cartItem changes
  useEffect(() => {
    if (!product) return;

    if (cartItem && cartItem.variantIndex != null) {
      setSelectedVariant(cartItem.variantIndex);
    } else if (product.variants.length > 0) {
      const defaultIndex = product.variants.findIndex((v) => v.isDefault);
      setSelectedVariant(defaultIndex >= 0 ? defaultIndex : 0);
    }
  }, [product, cartItem]);

  // Fetch product once slug or shopId changes
  const fetchProduct = useCallback(async () => {
    if (!slug || !shopId) return;

    try {
      const params = new URLSearchParams();
      params.set('shopId', shopId);
      const { data } = await axios.get<CustomProduct>(`/api/products/${slug}`, {
        params,
      });
      setProduct(data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        notFound();
      } else {
        console.error(clientErrorHandler(err));
      }
    }
  }, [slug, shopId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Compute average rating
  const avgRatings = useMemo(() => {
    if (!product) return;
    const total = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return product.reviews.length ? total / product.reviews.length : 0;
  }, [product]);

  const handleToggleCart = useCallback(() => {
    if (!product) return;
    dispatch(
      toggleCart({
        productId,
        shopId,
        variantIndex:
          selectedVariant >= 0 && selectedVariant < product.variants.length
            ? selectedVariant
            : undefined,
      }),
    );
  }, [dispatch, productId, shopId, selectedVariant, product]);

  const handleVariantChange = useCallback(
    (index: number) => {
      if (!product) return;
      if (index < 0 || index >= product.variants.length) return;
      setSelectedVariant(index);
      if (cartItem) {
        dispatch(
          updateCart({
            shopId,
            productId,
            variantIndex: index,
          }),
        );
      }
    },
    [dispatch, cartItem, shopId, productId, product],
  );

  if (!product) return null;
  if (!shop) return null;

  return (
    <Stack p={2} gap={2}>
      <Breadcrumbs>
        <Link href={generateURL(shop.subdomain)}>Home</Link>
        <Link href={`${generateURL(shop.subdomain)}/products`}>Products</Link>
        <Typography>{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={2}>
        {/* Left: Image */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            bgcolor='background.paper'
            sx={{
              position: 'relative',
              height: isMobile ? '50vh' : 'calc(100vh - 72px)',
              width: '100%',
            }}
          >
            <Image
              src={product.mainPic}
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
            />
          </Box>
        </Grid>

        {/* Right: Details */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack spacing={2}>
            <Typography variant='h4'>{product.name}</Typography>

            <Stack direction='row' justifyContent='space-between'>
              {product.stock > 0 ? (
                <Typography variant='body1' color='success.main'>
                  In Stock
                </Typography>
              ) : (
                <Typography variant='body1' color='error.main'>
                  Out of Stock
                </Typography>
              )}
              <Stack direction='row' gap={2} alignItems='center'>
                <Rating
                  precision={0.5}
                  value={avgRatings}
                  size='small'
                  readOnly
                />
                {!isMobile && (
                  <Typography variant='body2'>
                    {product.reviews.length} Reviews
                  </Typography>
                )}
              </Stack>
            </Stack>

            {product.discount > 0 ? (
              <Stack direction='row' gap={1} alignItems='flex-end'>
                <Typography
                  variant='body1'
                  sx={{ textDecoration: 'line-through' }}
                >
                  ₦{formatNumber(product.price.toFixed(0))}
                </Typography>
                <Typography variant='h5' fontWeight='bold' color='secondary'>
                  ₦
                  {formatNumber(
                    (
                      product.price -
                      (product.discount / 100) * product.price
                    ).toFixed(0),
                  )}
                </Typography>
                <Typography>|</Typography>
                <Typography>You Save</Typography>
                <Typography color='secondary' fontWeight='bold'>
                  ₦
                  {formatNumber(
                    ((product.discount / 100) * product.price).toFixed(0),
                  )}
                </Typography>
                <Typography color='secondary'>({product.discount}%)</Typography>
              </Stack>
            ) : (
              <Typography variant='h5' fontWeight='bold'>
                ₦{formatNumber(product.price.toFixed(0))}
              </Typography>
            )}

            {product.variants.length > 0 && (
              <>
                <Typography variant='body1'>Variants</Typography>
                <Stack direction='row' gap={2} flexWrap='wrap'>
                  {product.variants.map((variant, i) => (
                    <VariantElement
                      key={i}
                      isActive={i === selectedVariant}
                      onClick={() => handleVariantChange(i)}
                    >
                      {Object.entries(variant.attributes).map(
                        ([key, value]) => (
                          <Stack
                            key={key}
                            direction='row'
                            justifyContent='space-between'
                            minWidth={100}
                          >
                            <Typography
                              variant='body2'
                              textTransform='capitalize'
                            >
                              {key}:
                            </Typography>
                            <Typography
                              variant='body2'
                              textTransform='capitalize'
                            >
                              {value as string}
                            </Typography>
                          </Stack>
                        ),
                      )}
                    </VariantElement>
                  ))}
                </Stack>
              </>
            )}

            <Button
              variant='contained'
              fullWidth
              onClick={handleToggleCart}
              disabled={isToggling}
            >
              {cartItem ? 'Remove from Cart' : 'Add to Cart'}
            </Button>

            <Typography variant='body1'>Product Description</Typography>
            <Typography variant='body2' color='text.secondary'>
              {product.description}
            </Typography>

            <Typography variant='body1'>Product Details</Typography>
            <Grid container spacing={1}>
              <Grid size={6}>
                <Typography variant='body2' color='text.secondary'>
                  Weight:
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant='body2'>{product.weight} grams</Typography>
              </Grid>

              {product.dimensions && (
                <>
                  <Grid size={6}>
                    <Typography variant='body2' color='text.secondary'>
                      Dimensions:
                    </Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant='body2'>
                      {product.dimensions.length} x {product.dimensions.width} x{' '}
                      {product.dimensions.height} cm
                    </Typography>
                  </Grid>
                </>
              )}

              <Grid size={6}>
                <Typography variant='body2' color='text.secondary'>
                  Categories:
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant='body2'>
                  {product.categories.map((c) => c.name).join(', ')}
                </Typography>
              </Grid>

              <Grid size={6}>
                <Typography variant='body2' color='text.secondary'>
                  Tags:
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant='body2'>
                  {product.tags.join(', ')}
                </Typography>
              </Grid>
            </Grid>

            <Typography variant='body1'>Reviews</Typography>
            <Stack spacing={1}>
              {product.reviews.length > 0 ? (
                product.reviews.map((review, idx) => (
                  <Stack
                    key={idx}
                    direction='row'
                    justifyContent='space-between'
                  >
                    <Box>
                      <Stack direction='row' alignItems='center' gap={1}>
                        <Avatar sx={{ width: 24, height: 24 }} />
                        <Typography variant='body2'>
                          {review.user.username}
                        </Typography>
                      </Stack>
                      <Typography variant='body2'>
                        {review.comment || 'No comment provided.'}
                      </Typography>
                    </Box>
                    <Rating value={review.rating} readOnly />
                  </Stack>
                ))
              ) : (
                <Typography variant='body2' color='text.secondary'>
                  No reviews yet.
                </Typography>
              )}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ProductDetailsPage;
