'use client';

import { useAppSelector } from '@/hooks/redux.hook';
import { orderSchema } from '@/lib/schema/order';
import { calculateCartTotal, formatNumber } from '@/lib/utils';
import { getShopCart } from '@/redux/cartSlice';
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
  const { shop } = useAppSelector((state) => state.shop);
  const items = useAppSelector((state) => getShopCart(state, shop?._id || ''));
  const totalAmount = useMemo(() => calculateCartTotal(items), [items]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'online',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const submitOrder = () => {
    if (!validateForm()) return
  }

  return (
    <Stack py={2} px={{ xs: 1, sm: 2 }} gap={1}>
      <Typography variant="h6" textAlign={'center'}>
        Checkout
      </Typography>
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
            required
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
                        ? (productId.discount / 100) * productId.price
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
                  setFormData((prev) => ({ ...prev, paymentMethod: 'online' }))
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

          <Button variant='contained' onClick={() => submitOrder()}>Place Order</Button>
        </Section>
      </Stack>
    </Stack>
  );
};

export default CartPage;
