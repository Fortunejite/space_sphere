'use client';

import { useAppSelector } from '@/hooks/redux.hook';
import { calculateCartTotal, formatNumber, generateURL } from '@/lib/utils';
import { getShopCart } from '@/redux/cartSlice';
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

const CartPage = () => {
  const { shop } = useAppSelector((state) => state.shop);
  const items = useAppSelector((state) => getShopCart(state, shop?._id || ''));

  const totalAmount = useMemo(() => calculateCartTotal(items), [items]);

  if (!shop) return null;

  return (
    <Stack py={2} px={{ xs: 1, sm: 2 }} gap={1}>
      <Typography variant="h6">Your cart</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, sm: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(({ productId, quantity, variantIndex }, i) => {
                const amount =
                  productId.discount > 0
                    ? (productId.discount / 100) * productId.price
                    : productId.price;

                return (
                  <TableRow key={i}>
                    <TableCell>
                      <Stack
                        direction={'row'}
                        spacing={2}
                        alignItems={'center'}
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100px',
                            height: '100px',
                          }}
                        >
                          <Image
                            src={productId.mainPic}
                            alt={productId.name}
                            fill
                            objectFit="contain"
                          />
                        </Box>
                        <Stack>
                          <Typography>{productId.name}</Typography>
                          {productId.variants.length > 0 &&
                            Object.entries(
                              productId.variants[variantIndex].attributes,
                            ).map(([key, value]) => (
                              <Typography
                                key={key}
                                variant="body2"
                                textTransform="capitalize"
                              >
                                {key}: {value}
                              </Typography>
                            ))}
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>₦{formatNumber(amount.toFixed(0))}</TableCell>
                    <TableCell>{quantity}</TableCell>
                    <TableCell>
                      ₦{formatNumber((quantity * amount).toFixed(0))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack minWidth={300} spacing={2}>
          <Stack direction="row" justifyContent={'space-between'}>
            <Typography>Subtotal</Typography>
            <Typography>₦ {formatNumber(totalAmount.toFixed(0))}</Typography>
          </Stack>
          <Button
            variant="contained"
            LinkComponent={Link}
            href={`${generateURL(shop.subdomain)}/checkout`}
          >
            Checkout
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CartPage;
