import Image from 'next/image';
import Link from 'next/link';

import { styled, Box, Stack, Typography, Grid, Paper } from '@mui/material';

import { formatNumber } from '@/lib/formatNumber';
import { IProduct } from '@/models/Product.model';

interface ViewsProps {
  products: IProduct[];
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

const PriceSection = ({ product }: { product: IProduct }) => {
  if (product.discount > 0) {
    const discountAmount =
      product.price - (product.discount / 100) * product.price;
    return (
      <Stack direction='row' spacing={1}>
        <Typography variant='body2' component='p'>
          ₦{formatNumber(discountAmount.toFixed(0))}
        </Typography>
        <Typography
          variant='body2'
          color='secondary'
          sx={{ textDecoration: 'line-through' }}
        >
          ₦{formatNumber(product.price.toFixed(0))}
        </Typography>
      </Stack>
    );
  }
  return (
    <Typography variant='body2' component='p'>
      ₦{formatNumber(product.price.toFixed(0))}
    </Typography>
  );
};

const GridView = ({ products }: ViewsProps) => (
  <Grid container spacing={2}>
    {products.map((product) => (
      <Grid
        component={Link}
        href={`/products/${product.slug}`}
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
              <PriceSection product={product} />
            </Stack>
          </Stack>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

export default GridView;
