import Image from 'next/image';

import { Box, Paper, Stack, Typography } from '@mui/material';

import { IProduct } from '@/models/Product.model';
import { formatNumber } from '@/lib/formatNumber';

interface ViewsProps {
  products: IProduct[];
}

const PriceSection = ({ product }: { product: IProduct }) => {
  if (product.discount > 0) {
    const discountAmount =
      product.price - (product.discount / 100) * product.price;
    return (
      <Stack direction='row' spacing={1}>
        <Typography variant='body1' component='p'>
          ₦{formatNumber(discountAmount.toFixed(0))}
        </Typography>
        <Typography
          variant='body1'
          color='secondary'
          sx={{ textDecoration: 'line-through' }}
        >
          ₦{formatNumber(product.price.toFixed(0))}
        </Typography>
      </Stack>
    );
  }
  return (
    <Typography variant='body1' component='p'>
      ₦{formatNumber(product.price.toFixed(0))}
    </Typography>
  );
};

const ListView = ({ products }: ViewsProps) => (
  <Stack gap={1}>
    {products.map((product) => (
      <Paper key={product._id.toString()}>
        <Stack  direction={'row'} gap={2} p={1}>
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
              <PriceSection product={product} />
            </Stack>
            <Typography variant='body1'>Reviews: {product.reviews.length}</Typography>
          </Stack>
        </Stack>
      </Paper>
    ))}
  </Stack>
);

export default ListView;
