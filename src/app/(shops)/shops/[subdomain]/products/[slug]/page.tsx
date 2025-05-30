'use client';

import { useAppSelector } from '@/hooks/redux.hook';
import { clientErrorHandler } from '@/lib/errorHandler';
import { formatNumber, generateURL } from '@/lib/utils';
import { ICategory } from '@/models/Category.model';
import { IProduct } from '@/models/Product.model';
import { IUser } from '@/models/User.model';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Paper,
  Rating,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CustomProduct extends Omit<IProduct, 'categories' | 'reviews'> {
  categories: ICategory[];
  reviews: { user: IUser; rating: number; comment?: string; createdAt: Date }[];
}

// const QuantityChangeButton = styled(IconButton)(({ theme }) => ({
//   borderRadius: 4,
//   backgroundColor: theme.palette.primary.main,
//   height: '100%',
//   '&:hover': {
//     backgroundColor: theme.palette.primary.main,
//     opacity: 0.8,
//   },
//   '&:disabled': {
//     backgroundColor: theme.palette.primary.main,
//     opacity: 0.5,
//   },
// }));

// const QuantityControls = ({
//   product,
//   onAdd,
//   onSubtract,
// }: {
//   product: CustomProduct
//   onAdd: (e: MouseEvent) => void;
//   onSubtract: (e: MouseEvent) => void;
// }) => (
//   <Stack direction="row">
//     <QuantityChangeButton
//       disabled={cartItem.quantity <= 1 || status === 'loading'}
//       onClick={onSubtract}
//     >
//       <Remove />
//     </QuantityChangeButton>
//     <Box
//       flex={1}
//       sx={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       <Typography>{cartItem.quantity}</Typography>
//     </Box>
//     <QuantityChangeButton
//       disabled={cartItem.quantity >= productStock || status === 'loading'}
//       onClick={onAdd}
//     >
//       <Add />
//     </QuantityChangeButton>
//   </Stack>
// );

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const { shop } = useAppSelector((state) => state.shop);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  const [product, setProduct] = useState<CustomProduct | null>(
    {} as CustomProduct,
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const params = new URLSearchParams();
        params.set('shopId', shop._id.toString());
        const { data } = await axios.get(`/api/products/${slug}`, { params });
        setProduct(data);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 404)
          setProduct(null);
        console.error(clientErrorHandler(e));
      }
    };

    fetchProduct();
  }, [slug, shop._id]);

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
        <Link href={generateURL(shop.subdomain)}>Home</Link>
        <Link href={`${generateURL(shop.subdomain)}/products`}>Products</Link>
        <Typography>{product.name}</Typography>
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            bgcolor={'background.paper'}
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
              objectFit='contain'
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack spacing={2}>
            <Typography variant='h4'>{product.name}</Typography>
            <Stack direction={'row'} justifyContent={'space-between'}>
              {product.stock > 0 ? (
                <Typography variant='body1' color={'success'}>
                  In Stock
                </Typography>
              ) : (
                <Typography variant='body1' color={'error'}>
                  Out Stock
                </Typography>
              )}

              <Stack direction='row' gap={2}>
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
              <Stack direction={'row'} gap={1} alignItems={'end'}>
                <Typography
                  variant='body1'
                  sx={{ textDecoration: 'line-through' }}
                >
                  ₦{formatNumber(product.price.toFixed(0))}
                </Typography>

                <Typography
                  variant='h5'
                  component='p'
                  fontWeight={'bold'}
                  color='secondary'
                >
                  ₦
                  {formatNumber(
                    (
                      product.price -
                      (product.discount / 100) * product.price
                    ).toFixed(0),
                  )}
                </Typography>
                <Typography variant='body1' ml={1}>
                  |
                </Typography>
                <Typography variant='body1'>You Save</Typography>
                <Typography color='secondary' fontWeight={'bold'}>
                  ₦
                  {formatNumber(
                    ((product.discount / 100) * product.price).toFixed(0),
                  )}
                </Typography>
                <Typography color='secondary'>({product.discount}%)</Typography>
              </Stack>
            ) : (
              <Stack direction={'row'}>
                <Typography variant='h5' fontWeight={'bold'}>
                  ₦{formatNumber(product.price.toFixed(0))}
                </Typography>
              </Stack>
            )}

            {product.variants.length > 0 && (
              <>
                <Typography variant='body1'>Variants</Typography>
                <Stack direction={'row'} gap={2} flexWrap='wrap'>
                  {product.variants.map((variant, i) => (
                    <Paper
                      key={i}
                      sx={{
                        p: 1,
                        cursor: 'pointer',
                      }}
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
                    </Paper>
                  ))}
                </Stack>
              </>
            )}

            <Button variant='contained' fullWidth>
              Add to Cart
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
                  {product.categories.map((cat) => cat.name).join(', ')}
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
                product.reviews.map((review, index) => (
                  <Stack
                    key={index}
                    justifyContent='space-between'
                    direction='row'
                  >
                    <Box>
                      <Stack direction={'row'}>
                        <Avatar sx={{ height: 24, width: 24 }} />
                        <Typography variant='body2'>
                          {review.user?.username}
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
