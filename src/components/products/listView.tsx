import Image from 'next/image';
import Link from 'next/link';

import { Box, Paper, Stack, Typography } from '@mui/material';

import { IProduct } from '@/models/Product.model';

import { generateURL } from '@/lib/utils';
import { formatCurrency } from '@/lib/currency';
import { ShopWithStats } from '@/types/shop';

interface ViewsProps {
  products: IProduct[];
  shop?: ShopWithStats;
}

const PriceSection = ({ product, currency }: { product: IProduct, currency: string | undefined }) => {
  if (product.discount > 0) {
    const discountAmount =
      product.price - (product.discount / 100) * product.price;
    return (
      <Stack direction='row' spacing={1}>
        <Typography variant='body1' component='p'>
          {formatCurrency(discountAmount, currency)}
        </Typography>
        <Typography
          variant='body1'
          color='secondary'
          sx={{ textDecoration: 'line-through' }}
        >
          {formatCurrency(product.price, currency)}
        </Typography>
      </Stack>
    );
  }
  return (
    <Typography variant='body1' component='p'>
      {formatCurrency(product.price, currency)}
    </Typography>
  );
};

const ListView = ({ products, shop }: ViewsProps) => (
  <Stack gap={1}>
    {products.map((product) => (
      <Paper
        key={product._id.toString()}
        component={Link}
        href={`${shop ? generateURL(shop.subdomain) : ''}/products/${
          product.slug
        }`}
      >
        <Stack direction={'row'} gap={2} p={1}>
          <Box
            sx={{
              position: 'relative',
              height: '100px',
              width: '100px',
            }}
          >
            <Image
              src={product.mainPic}
              alt={product.name}
              fill
              objectFit='contain'
            />
          </Box>
          <Stack justifyContent={'end'}>
            <Typography variant='h6'>{product.name}</Typography>
            <Stack direction='column' spacing={1}>
              <PriceSection product={product} currency={shop?.currency} />
            </Stack>
            <Typography variant='body1'>
              Reviews: {product.reviews.length}
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    ))}
  </Stack>
);

export default ListView;
