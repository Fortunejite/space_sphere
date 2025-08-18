'use client';

import { useSnackbar } from '@/context/snackbar';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { calculateCartTotal, generateURL } from '@/lib/utils';
import { fetchCart, getShopCart } from '@/redux/cartSlice';
import {
  Box,
  Button,
  Divider,
  Stack,
  styled,
  TextField,
  Typography,
  Card,
  CardContent,
  Chip,
  Radio,
  Avatar,
  alpha,
  useTheme,
  CircularProgress,
  IconButton,
  Collapse,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  Theme,
  InputAdornment,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
} from '@mui/material';
import {
  LocalShippingOutlined,
  PaymentOutlined,
  SecurityOutlined,
  CheckCircleOutlined,
  PersonOutlined,
  LocationOnOutlined,
  CreditCardOutlined,
  AccountBalanceWalletOutlined,
  ExpandMoreOutlined,
  ExpandLessOutlined,
  ShoppingBagOutlined,
  DiscountOutlined,
  LocalOfferOutlined,
  PhoneOutlined,
  EmailOutlined,
  EditOutlined,
  ArrowBackOutlined,
  LockOutlined,
  VerifiedUserOutlined,
} from '@mui/icons-material';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/currency';

const CheckoutCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9,
  )} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}`,
  },
}));

const PaymentMethodCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  borderRadius: theme.spacing(1.5),
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: isSelected
    ? `2px solid ${theme.palette.primary.main}`
    : `2px solid ${alpha(theme.palette.divider, 0.2)}`,
  background: isSelected
    ? alpha(theme.palette.primary.main, 0.05)
    : theme.palette.background.paper,
  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const steps = [
  { label: 'Billing Information', icon: PersonOutlined },
  { label: 'Payment Method', icon: PaymentOutlined },
  { label: 'Review Order', icon: CheckCircleOutlined },
];

const CheckoutPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const { shop, status: shopStatus } = useAppSelector((state) => state.shop);
  const items = useAppSelector((state) => getShopCart(state, shop?._id || ''));
  const totalAmount = useMemo(() => calculateCartTotal(items), [items]);
  const { setIsOpen, setMessage } = useSnackbar();

  const [activeStep, setActiveStep] = useState(0);
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
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const deliveryFee = 2500;
  const subtotal = totalAmount;
  const finalTotal = subtotal + deliveryFee - promoDiscount;

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

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.name.trim()) errors.name = 'Name is required';
      if (!formData.email.trim()) errors.email = 'Email is required';
      if (!formData.phone.trim()) errors.phone = 'Phone is required';
      if (!formData.address.trim()) errors.address = 'Address is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const submitOrder = async () => {
    try {
      setLoading(true);
      if (!validateStep(0)) return;

      const res = await axios.post(
        `/api/shops/${shop?.subdomain}/orders`,
        formData,
      );

      setTrackingId(res.data.trackingId);
      setIsSuccess(true);
      dispatch(fetchCart());
    } catch (error) {
      console.error('Error submitting order:', error);
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'An error occurred');
      } else {
        setMessage('An unexpected error occurred');
      }
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setPromoDiscount(subtotal * 0.1);
      setMessage('Promo code applied! 10% discount');
      setIsOpen(true);
    } else if (promoCode.toLowerCase() === 'welcome') {
      setPromoDiscount(5000);
      setMessage('Welcome discount applied! ₦5,000 off');
      setIsOpen(true);
    } else {
      setMessage('Invalid promo code');
      setIsOpen(true);
    }
  };

  const paymentMethods = [
    {
      id: 'online',
      label: 'Pay Now',
      description: 'Secure payment with card or bank transfer',
      icon: CreditCardOutlined,
      recommended: true,
    },
    {
      id: 'delivery',
      label: 'Pay on Delivery',
      description: 'Pay when your order arrives',
      icon: LocalShippingOutlined,
      recommended: false,
    },
    {
      id: 'wallet',
      label: 'Digital Wallet',
      description: 'Pay with your mobile wallet',
      icon: AccountBalanceWalletOutlined,
      recommended: false,
    },
  ];

  // Success Screen
  if (isSuccess && trackingId) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        p={4}
      >
        <CheckoutCard
          sx={{ maxWidth: 600, width: '100%', textAlign: 'center' }}
        >
          <CardContent sx={{ p: 6 }}>
            <Avatar
              sx={{
                bgcolor: 'success.main',
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
              }}
            >
              <CheckCircleOutlined sx={{ fontSize: 40 }} />
            </Avatar>

            <Typography
              variant="h4"
              gutterBottom
              color="success.main"
              fontWeight="bold"
            >
              Order Placed Successfully!
            </Typography>

            <Typography variant="body1" color="text.secondary" mb={3}>
              Thank you for your purchase. Your order has been confirmed and
              will be processed shortly.
            </Typography>

            <Card
              sx={{
                p: 2,
                mb: 3,
                bgcolor: alpha(theme.palette.success.main, 0.1),
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <LocalOfferOutlined color="success" />
                <Box>
                  <Typography variant="subtitle2" color="success.main">
                    Tracking ID
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {trackingId}
                  </Typography>
                </Box>
              </Stack>
            </Card>

            <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
              <Button
                variant="contained"
                component={Link}
                href={`${generateURL(shop?.subdomain)}/orders`}
                startIcon={<ShoppingBagOutlined />}
                fullWidth={isMobile}
              >
                Track Order
              </Button>
              <Button
                variant="outlined"
                component={Link}
                href={`${generateURL(shop?.subdomain)}/products`}
                fullWidth={isMobile}
              >
                Continue Shopping
              </Button>
            </Stack>
          </CardContent>
        </CheckoutCard>
      </Box>
    );
  }

  if (!shop) return null;

  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette.primary.main, 0.02),
        minHeight: '100vh',
        py: 4,
      }}
    >
      <Box maxWidth="1200px" mx="auto" px={{ xs: 2, sm: 4 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <IconButton
            onClick={() => router.back()}
            sx={{
              bgcolor: 'background.paper',
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            }}
          >
            <ArrowBackOutlined />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              Secure Checkout
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
              <LockOutlined fontSize="small" color="success" />
              <Typography variant="body2" color="text.secondary">
                SSL Encrypted • Your information is safe
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          {/* Checkout Form */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {/* Progress Stepper */}
              <CheckoutCard>
                <CardContent>
                  <Stepper
                    activeStep={activeStep}
                    orientation={isMobile ? 'vertical' : 'horizontal'}
                  >
                    {steps.map((step, index) => {
                      const StepIcon = step.icon;
                      return (
                        <Step key={step.label}>
                          <StepLabel
                            StepIconComponent={() => (
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor:
                                    index <= activeStep
                                      ? 'primary.main'
                                      : 'grey.300',
                                  color: 'white',
                                }}
                              >
                                <StepIcon fontSize="small" />
                              </Avatar>
                            )}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight={
                                index <= activeStep ? 'bold' : 'normal'
                              }
                              color={
                                index <= activeStep
                                  ? 'primary.main'
                                  : 'text.secondary'
                              }
                            >
                              {step.label}
                            </Typography>
                          </StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                </CardContent>
              </CheckoutCard>

              {/* Step 1: Billing Information */}
              {activeStep === 0 && (
                <CheckoutCard>
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={3}
                    >
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <PersonOutlined />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Billing Information
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Enter your details for delivery
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack spacing={2}>
                      <TextField
                        required
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        onChange={handleFormChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlined color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                      >
                        <TextField
                          required
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          error={!!formErrors.email}
                          helperText={formErrors.email}
                          onChange={handleFormChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailOutlined color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          required
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={formData.phone}
                          error={!!formErrors.phone}
                          helperText={formErrors.phone}
                          onChange={handleFormChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneOutlined color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Stack>

                      <TextField
                        required
                        fullWidth
                        label="Delivery Address"
                        name="address"
                        multiline
                        rows={3}
                        value={formData.address}
                        error={!!formErrors.address}
                        helperText={formErrors.address}
                        onChange={handleFormChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlined color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Order Notes (Optional)"
                        name="note"
                        multiline
                        rows={3}
                        value={formData.note}
                        onChange={handleFormChange}
                        placeholder="Any special instructions for delivery..."
                      />
                    </Stack>

                    <Box mt={3} display="flex" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        size="large"
                        sx={{ minWidth: 140 }}
                      >
                        Continue
                      </Button>
                    </Box>
                  </CardContent>
                </CheckoutCard>
              )}

              {/* Step 2: Payment Method */}
              {activeStep === 1 && (
                <CheckoutCard>
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={3}
                    >
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <PaymentOutlined />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Payment Method
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Choose how you&apos;d like to pay
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack spacing={2}>
                      {paymentMethods.map((method) => {
                        const IconComponent = method.icon;
                        return (
                          <PaymentMethodCard
                            key={method.id}
                            isSelected={formData.paymentMethod === method.id}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                paymentMethod: method.id,
                              }))
                            }
                          >
                            <CardContent>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Avatar
                                  sx={{
                                    bgcolor:
                                      formData.paymentMethod === method.id
                                        ? 'primary.main'
                                        : alpha(
                                            theme.palette.primary.main,
                                            0.1,
                                          ),
                                    color:
                                      formData.paymentMethod === method.id
                                        ? 'white'
                                        : 'primary.main',
                                  }}
                                >
                                  <IconComponent />
                                </Avatar>
                                <Box flex={1}>
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight="bold"
                                    >
                                      {method.label}
                                    </Typography>
                                    {method.recommended && (
                                      <Chip
                                        label="Recommended"
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                    )}
                                  </Stack>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {method.description}
                                  </Typography>
                                </Box>
                                <Radio
                                  checked={formData.paymentMethod === method.id}
                                  onChange={() => {}}
                                  color="primary"
                                />
                              </Stack>
                            </CardContent>
                          </PaymentMethodCard>
                        );
                      })}
                    </Stack>

                    <Stack direction="row" spacing={2} mt={3}>
                      <Button
                        onClick={handleBack}
                        size="large"
                        sx={{ minWidth: 140 }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        size="large"
                        sx={{ minWidth: 140 }}
                      >
                        Review Order
                      </Button>
                    </Stack>
                  </CardContent>
                </CheckoutCard>
              )}

              {/* Step 3: Review Order */}
              {activeStep === 2 && (
                <CheckoutCard>
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={3}
                    >
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <CheckCircleOutlined />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Review Your Order
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Confirm your details before placing the order
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Card
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          flex: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="primary.main"
                          gutterBottom
                        >
                          Billing Information
                        </Typography>
                        <Stack spacing={1}>
                          <Typography variant="body2">
                            {formData.name}
                          </Typography>
                          <Typography variant="body2">
                            {formData.email}
                          </Typography>
                          <Typography variant="body2">
                            {formData.phone}
                          </Typography>
                          <Typography variant="body2">
                            {formData.address}
                          </Typography>
                        </Stack>
                        <Button
                          size="small"
                          startIcon={<EditOutlined />}
                          onClick={() => setActiveStep(0)}
                          sx={{ mt: 1 }}
                        >
                          Edit
                        </Button>
                      </Card>

                      <Card
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.success.main, 0.05),
                          flex: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="success.main"
                          gutterBottom
                        >
                          Payment Method
                        </Typography>
                        <Typography variant="body2">
                          {
                            paymentMethods.find(
                              (m) => m.id === formData.paymentMethod,
                            )?.label
                          }
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<EditOutlined />}
                          onClick={() => setActiveStep(1)}
                          sx={{ mt: 1 }}
                        >
                          Change
                        </Button>
                      </Card>
                    </Stack>

                    <Alert severity="info" sx={{ mt: 3 }}>
                      <AlertTitle>Order Confirmation</AlertTitle>
                      By placing this order, you agree to our terms and
                      conditions. You will receive an email confirmation
                      shortly.
                    </Alert>

                    <Stack direction="row" spacing={2} mt={3}>
                      <Button
                        onClick={handleBack}
                        size="large"
                        sx={{ minWidth: 140 }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        onClick={submitOrder}
                        disabled={loading}
                        size="large"
                        sx={{ minWidth: 140 }}
                        startIcon={
                          loading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <SecurityOutlined />
                          )
                        }
                      >
                        {loading ? 'Processing...' : 'Place Order'}
                      </Button>
                    </Stack>
                  </CardContent>
                </CheckoutCard>
              )}
            </Stack>
          </Box>

          {/* Order Summary */}
          <Box sx={{ width: { xs: '100%', md: 400 } }}>
            <Stack spacing={3}>
              {/* Mobile Order Summary Toggle */}
              {isMobile && (
                <CheckoutCard>
                  <CardContent>
                    <Button
                      fullWidth
                      onClick={() => setShowOrderSummary(!showOrderSummary)}
                      endIcon={
                        showOrderSummary ? (
                          <ExpandLessOutlined />
                        ) : (
                          <ExpandMoreOutlined />
                        )
                      }
                      sx={{ justifyContent: 'space-between' }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <ShoppingBagOutlined />
                        <Typography>Order Summary</Typography>
                      </Stack>
                      <Typography fontWeight="bold">
                        {formatCurrency(finalTotal, shop.currency)}
                      </Typography>
                    </Button>
                    <Collapse in={showOrderSummary}>
                      <Box mt={2}>
                        <OrderSummaryContent />
                      </Box>
                    </Collapse>
                  </CardContent>
                </CheckoutCard>
              )}

              {/* Desktop Order Summary */}
              {!isMobile && (
                <CheckoutCard sx={{ position: 'sticky', top: 20 }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={3}
                    >
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        <ShoppingBagOutlined />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        Order Summary
                      </Typography>
                    </Stack>
                    <OrderSummaryContent />
                  </CardContent>
                </CheckoutCard>
              )}

              {/* Security Badge */}
              <Card
                sx={{
                  textAlign: 'center',
                  p: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                  mb={1}
                >
                  <VerifiedUserOutlined color="success" />
                  <Typography
                    variant="subtitle2"
                    color="success.main"
                    fontWeight="bold"
                  >
                    Secure Checkout
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Your payment information is protected with 256-bit SSL
                  encryption
                </Typography>
              </Card>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  function OrderSummaryContent() {
    return (
      <Stack spacing={2}>
        {/* Items */}
        <List dense>
          {items.map(({ productId, quantity }, i) => {
            const amount =
              productId.discount > 0
                ? productId.price - (productId.discount / 100) * productId.price
                : productId.price;
            return (
              <ListItem key={i} sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Badge badgeContent={quantity} color="primary">
                    <Avatar
                      src={'/placeholder.png'}
                      sx={{ width: 50, height: 50 }}
                    />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" noWrap>
                      {productId.name}
                    </Typography>
                  }
                  secondary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(amount, shop?.currency)}
                      </Typography>
                      {productId.discount > 0 && (
                        <Chip
                          label={`${productId.discount}% OFF`}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  }
                />
                <Typography variant="subtitle2" fontWeight="bold">
                  {formatCurrency(quantity * amount, shop?.currency)}
                </Typography>
              </ListItem>
            );
          })}
        </List>

        <Divider />

        {/* Promo Code */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" fontWeight="bold">
            Promo Code
          </Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DiscountOutlined color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              onClick={applyPromoCode}
              disabled={!promoCode.trim()}
            >
              Apply
            </Button>
          </Stack>
          {promoDiscount > 0 && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Promo code applied! You saved
              {formatCurrency(promoDiscount, shop?.currency)}
            </Alert>
          )}
        </Stack>

        <Divider />

        {/* Totals */}
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Subtotal</Typography>
            <Typography>{formatCurrency(subtotal, shop?.currency)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Delivery Fee</Typography>
            <Typography>
              {formatCurrency(deliveryFee, shop?.currency)}
            </Typography>
          </Stack>
          {promoDiscount > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography color="success.main">Discount</Typography>
              <Typography color="success.main">
                -{formatCurrency(promoDiscount, shop?.currency)}
              </Typography>
            </Stack>
          )}
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6" fontWeight="bold">
              Total
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              {formatCurrency(finalTotal, shop?.currency)}
            </Typography>
          </Stack>
        </Stack>

        {/* Estimated Delivery */}
        <Card sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <LocalShippingOutlined color="info" />
            <Box>
              <Typography variant="subtitle2" color="info.main">
                Estimated Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2-4 business days
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Stack>
    );
  }
};

export default CheckoutPage;
