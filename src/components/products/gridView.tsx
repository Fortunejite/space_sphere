import Image from 'next/image';
import Link from 'next/link';

import { styled, Box, Stack, Typography, Grid, Paper } from '@mui/material';

import { generateURL } from '@/lib/utils';
import { IProduct } from '@/models/Product.model';
import { formatCurrency } from '@/lib/currency';
import { ShopWithStats } from '@/types/shop';

interface ViewsProps {
  products: IProduct[];
  shop?: ShopWithStats;
}

const Badge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  borderRadius: 4,
  padding: '0 8px',
}));

const PriceSection = ({ product, currency }: { product: IProduct, currency: string | undefined }) => {
  if (product.discount > 0) {
    const discountAmount =
      product.price - (product.discount / 100) * product.price;
    return (
      <Stack direction='row' spacing={1}>
        <Typography variant='body2' component='p'>
          {formatCurrency(discountAmount, currency)}
        </Typography>
        <Typography
          variant='body2'
          color='secondary'
          sx={{ textDecoration: 'line-through' }}
        >
          {formatCurrency(product.price, currency)}
        </Typography>
      </Stack>
    );
  }
  return (
    <Typography variant='body2' component='p'>
      {formatCurrency(product.price, currency)}
    </Typography>
  );
};

const GridView = ({ products, shop }: ViewsProps) => (
  <Grid container spacing={2}>
    {products.map((product) => (
      <Grid
        component={Link}
        href={`${shop ? generateURL(shop.subdomain): ''}/products/${
          product.slug
        }`}
        key={product._id.toString()}
        size={{ xs: 6, sm: 3 }}
      >
        <Paper
          sx={{
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              height: '200px',
              width: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box sx={{ position: 'relative', width: '70%', height: '100%' }}>
              <Image
                src={product.mainPic}
                alt={product.name}
                fill
                objectFit='contain'
              />
            </Box>
            {product.discount > 0 && (
              <Badge>
                <Typography variant='body1'>- {product.discount}%</Typography>
              </Badge>
            )}
          </Box>
          <Stack p={1}>
            <Typography variant='body1'>{product.name}</Typography>
            <Stack direction='column' spacing={1}>
              <PriceSection product={product} currency={shop?.currency} />
            </Stack>
          </Stack>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

export default GridView;
