'use client';

import { useSnackbar } from '@/context/snackbar';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { orderSchema } from '@/lib/schema/order';
import { calculateCartTotal, formatNumber, generateURL } from '@/lib/utils';
import { fetchCart, getShopCart } from '@/redux/cartSlice';
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useMemo, useState } from 'react';
import { ZodError } from 'zod';

const PaymentMethodSelect = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  padding: theme.spacing(1),
  cursor: 'pointer',
  border: isActive ? `1px solid ${theme.palette.primary.main}` : 'none',
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
}));

const Section = styled(Stack)(({ theme }) => ({
  flex: 1,
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  border: `2px solid ${theme.palette.background.paper}`,
}));

const CartPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { shop, status: shopStatus } = useAppSelector((state) => state.shop);
  const items = useAppSelector((state) => getShopCart(state, shop?._id || ''));
  const totalAmount = useMemo(() => calculateCartTotal(items), [items]);
  const { setIsOpen, setMessage } = useSnackbar();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'online',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  if (shopStatus === 'succeeded' && items.length === 0 && !isSuccess) {
    router.replace(`${generateURL(shop?.subdomain)}/cart`);
    return null;
  }

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    try {
      orderSchema.parse(formData);
    } catch (err) {
      if (err instanceof ZodError) {
        err.errors.forEach((e) => {
          errors[e.path[0]] = e.message;
        });
      }
    } finally {
      setFormErrors(errors);
    }

    return Object.keys(errors).length === 0;
  };

  const submitOrder = async () => {
    try {
      setLoading(true);
      if (!validateForm()) return;
      const res = await axios.post('/api/orders', {
        ...formData,
        shopId: shop?._id,
      });
      console.log('Order response:', res.data);
      setTrackingId(res.data.trackingId);
      setIsSuccess(true);
      dispatch(fetchCart()); // Refresh cart after order
    } catch (error) {
      console.error('Error submitting order:', error);
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'An error occurred');
      } else {
        setMessage('An unexpected error occurred');
      }
      setIsOpen(true);
      return;
    } finally {
      setLoading(false);
    }
  };

  const SuccessModal = () => {
    return (
      <Stack
        flex={1}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{ width: '100%' }}
        gap={2}
        p={2}
      >
        <Typography variant="h6" textAlign={'center'}>
          Order Successful
        </Typography>
        <Typography textAlign={'center'}>
          Your order has been placed successfully. Your tracking ID is:{' '}
          <Link href={`${generateURL(shop?.subdomain)}/orders/${trackingId}`}>
            {trackingId}
          </Link>
        </Typography>
      </Stack>
    );
  };

  return (
    <Stack py={2} px={{ xs: 1, sm: 2 }} gap={1} flex={1}>
      <Typography variant="h5" textAlign={'center'}>
        Checkout
      </Typography>
      {isSuccess && trackingId ? (
        <SuccessModal />
      ) : (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Section>
            <Typography variant="h6">Billing Details</Typography>
            <TextField
              required
              label="Name"
              variant="outlined"
              name="name"
              value={formData.name}
              error={!!formErrors.name}
              helperText={formErrors.name}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              required
              label="Email"
              variant="outlined"
              name="email"
              value={formData.email}
              error={!!formErrors.email}
              helperText={formErrors.email}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              required
              label="Phone Number"
              variant="outlined"
              name="phone"
              value={formData.phone}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              required
              label="Address"
              variant="outlined"
              name="address"
              value={formData.address}
              error={!!formErrors.address}
              helperText={formErrors.address}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Order Notes"
              variant="outlined"
              name="note"
              value={formData.note}
              error={!!formErrors.note}
              helperText={formErrors.note}
              onChange={handleFormChange}
              multiline
              rows={4}
              fullWidth
            />
          </Section>
          <Section>
            <Box>
              <Typography variant="h6">Your Order</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map(({ productId, quantity }, i) => {
                      const amount =
                        productId.discount > 0
                          ? productId.price -
                            (productId.discount / 100) * productId.price
                          : productId.price;
                      return (
                        <TableRow key={i}>
                          <TableCell>{productId.name}</TableCell>
                          <TableCell>
                            ₦{formatNumber(amount.toFixed(0))}
                          </TableCell>
                          <TableCell>{quantity}</TableCell>
                          <TableCell>
                            ₦{formatNumber((quantity * amount).toFixed(0))}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell>Total</TableCell>
                      <TableCell colSpan={2} />
                      <TableCell>
                        ₦{formatNumber(totalAmount.toFixed(0))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Divider
              sx={{
                marginTop: 2,
                marginBottom: 2,
              }}
            />
            <Box>
              <Typography variant="h6">Payment Method</Typography>
              <Stack direction="row" spacing={2} mt={1}>
                <PaymentMethodSelect
                  isActive={formData.paymentMethod === 'online'}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMethod: 'online',
                    }))
                  }
                >
                  <Typography>Pay Now</Typography>
                </PaymentMethodSelect>
                <PaymentMethodSelect
                  isActive={formData.paymentMethod === 'delivery'}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMethod: 'delivery',
                    }))
                  }
                >
                  <Typography>Pay on Delivery</Typography>
                </PaymentMethodSelect>
              </Stack>
            </Box>

            <Button
              variant="contained"
              disabled={loading}
              onClick={() => submitOrder()}
            >
              Place Order
            </Button>
          </Section>
        </Stack>
      )}
    </Stack>
  );
};

export default CartPage;
