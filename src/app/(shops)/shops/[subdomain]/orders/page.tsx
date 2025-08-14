'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  Stack,
  Grid,
  Button,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Badge,
  alpha,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@mui/material';
import {
  ShoppingBagOutlined,
  SearchOutlined,
  FilterListOutlined,
  RefreshOutlined,
  DownloadOutlined,
  WarningOutlined,
  PhoneOutlined,
  EmailOutlined,
  ChatOutlined,
  SupportAgentOutlined,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatNumber, generateURL } from '@/lib/utils';
import { IOrder } from '@/models/Order.model';
import { IProduct } from '@/models/Product.model';
import axios from 'axios';
import { useAppSelector } from '@/hooks/redux.hook';
import OrderCard from '@/components/orderCard';

const EmptyOrdersState = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.03,
        )} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
      }}
    >
      <ShoppingBagOutlined
        sx={{ fontSize: 120, color: 'text.disabled', mb: 2 }}
      />
      <Typography variant="h5" gutterBottom fontWeight={600}>
        No Orders Yet
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}
      >
        You haven&apos;t placed any orders yet. Start shopping to see your order
        history here.
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<ShoppingBagOutlined />}
        sx={{ borderRadius: 2, px: 4 }}
        onClick={() => router.push(`${generateURL('shop-subdomain')}/products`)}
      >
        Start Shopping
      </Button>
    </Paper>
  );
};

const OrdersPage = () => {
  const theme = useTheme();
  const { shop } = useAppSelector((state) => state.shop);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const shopId = shop?._id || null;

  // Data states
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [page, setPage] = useState(1);

  // Modal states
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [reorderModalOpen, setReorderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [fetchOrderStatus, setFetchOrderStatus] = useState(true);

  const tabLabels = [
    'All Orders',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];
  const statusFilters = [
    'all',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      selectedTab === 0 || order.status === statusFilters[selectedTab];
    const searchMatch =
      searchQuery === '' ||
      order.trackingId.toString().includes(searchQuery.toLowerCase()) ||
      order.cartItems.some((item) =>
        (item.product as IProduct).name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    return statusMatch && searchMatch;
  });

  // Move fetchOrders outside useEffect to avoid self-reference error
  const fetchOrders = async (): Promise<void> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (shopId) {
      params.append('shopId', shopId);
    }
    if (fetchOrderStatus) {
      params.append('status', 'true');
    }
    const res = await axios.get('/api/orders', {
      params,
    });
    setOrders(res.data.data);
    if (fetchOrderStatus) setOrderStats(res.data.stats);
    setFetchOrderStatus(false); // Reset after first fetch
  };

  useEffect(() => {
    if (shopId) fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, shopId]);

  // Modal handlers
  const handleCancelOrder = (order: IOrder) => {
    setSelectedOrder(order);
    setCancelModalOpen(true);
  };

  const handleSupportRequest = (order: IOrder) => {
    setSelectedOrder(order);
    setSupportModalOpen(true);
  };

  const handleReorder = (order: IOrder) => {
    setSelectedOrder(order);
    setReorderModalOpen(true);
  };

  const confirmCancelOrder = () => {
    // Handle order cancellation logic here
    console.log('Cancelling order:', selectedOrder?._id);
    setCancelModalOpen(false);
    setSelectedOrder(null);
  };

  const confirmReorder = () => {
    // Handle reorder logic here
    console.log('Reordering:', selectedOrder?._id);
    setReorderModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Your Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage all your orders in one place
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<DownloadOutlined />}
          sx={{ borderRadius: 2, display: { xs: 'none', sm: 'flex' } }}
        >
          Export Orders
        </Button>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={2} mb={4}>
        <Grid size={{ xs: 12, sm: 2.4 }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="primary.main" fontWeight={700}>
              {orderStats.total || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Orders
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 2.4 }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="warning.main" fontWeight={700}>
              {orderStats.processing || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Processing
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 2.4 }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="info.main" fontWeight={700}>
              {orderStats.shipped || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Shipped
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 2.4 }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="success.main" fontWeight={700}>
              {orderStats.delivered || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Delivered
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 2.4 }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="error.main" fontWeight={700}>
              {orderStats.cancelled || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cancelled
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <TextField
            placeholder="Search orders by ID or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
            size="small"
          />
          <Button
            variant="outlined"
            startIcon={<FilterListOutlined />}
            sx={{ borderRadius: 2, minWidth: 120 }}
          >
            Filters
          </Button>
        </Stack>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 500,
              minHeight: 64,
            },
          }}
        >
          {tabLabels.map((label, index) => (
            <Tab
              key={label}
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>{label}</span>
                  {index > 0 && (
                    <Badge
                      badgeContent={Object.values(orderStats)[index]}
                      color="primary"
                      max={99}
                    />
                  )}
                </Stack>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Orders List */}
      <Box>
        {filteredOrders.length === 0 ? (
          searchQuery ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <SearchOutlined
                sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                No orders found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search terms or filters
              </Typography>
            </Paper>
          ) : (
            <EmptyOrdersState />
          )
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.trackingId}
              order={order}
              onCancelOrder={handleCancelOrder}
              onSupportRequest={handleSupportRequest}
              onReorder={handleReorder}
            />
          ))
        )}
      </Box>

      {/* Cancel Order Modal */}
      <Dialog
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningOutlined color="error" />
          Cancel Order Confirmation
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to cancel order{' '}
            <strong>#{selectedOrder?.trackingId}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This action cannot be undone. Once cancelled, you will need to place
            a new order if you still want these items.
          </Typography>
          {selectedOrder && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Order Details:
              </Typography>
              <Typography variant="body2">
                Total: ₦{formatNumber(selectedOrder.totalAmount)}
              </Typography>
              <Typography variant="body2">
                Items: {selectedOrder.cartItems.length} item(s)
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setCancelModalOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Keep Order
          </Button>
          <Button
            onClick={confirmCancelOrder}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Cancel Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Customer Support Modal */}
      <Dialog
        open={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SupportAgentOutlined color="primary" />
          Customer Support
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Need help with order <strong>#{selectedOrder?.trackingId}</strong>?
            We&apos;re here to assist you!
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <PhoneOutlined
                  sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h6" gutterBottom>
                  Call Us
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Speak directly with our support team
                </Typography>
                <Link href="tel:+2348012345678" underline="none">
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ borderRadius: 2 }}
                  >
                    +234 801 234 5678
                  </Button>
                </Link>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <EmailOutlined
                  sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h6" gutterBottom>
                  Email Us
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Get detailed help via email
                </Typography>
                <Link href="mailto:support@shopsphere.com" underline="none">
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ borderRadius: 2 }}
                  >
                    support@shopsphere.com
                  </Button>
                </Link>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <ChatOutlined
                  sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h6" gutterBottom>
                  Live Chat
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Chat with us in real-time
                </Typography>
                <Button variant="contained" fullWidth sx={{ borderRadius: 2 }}>
                  Start Chat
                </Button>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Support Hours:
            </Typography>
            <List dense>
              <ListItem disablePadding>
                <ListItemText primary="Monday - Friday: 8:00 AM - 8:00 PM" />
              </ListItem>
              <ListItem disablePadding>
                <ListItemText primary="Saturday: 9:00 AM - 6:00 PM" />
              </ListItem>
              <ListItem disablePadding>
                <ListItemText primary="Sunday: 10:00 AM - 4:00 PM" />
              </ListItem>
            </List>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setSupportModalOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reorder Confirmation Modal */}
      <Dialog
        open={reorderModalOpen}
        onClose={() => setReorderModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RefreshOutlined color="primary" />
          Reorder Confirmation
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Reorder items from order <strong>#{selectedOrder?.id}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            All items from this order will be added to your cart. You can modify
            quantities before checkout.
          </Typography>

          {selectedOrder && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Items to Reorder:
              </Typography>
              <Stack spacing={1}>
                {selectedOrder.cartItems.map((item, index: number) => (
                  <Stack
                    key={index}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2">
                      {item.product.name} × {item.quantity}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ₦{item.price.toLocaleString()}
                    </Typography>
                  </Stack>
                ))}
                <Divider />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle2">Total:</Typography>
                  <Typography variant="subtitle2" fontWeight={700}>
                    ₦{selectedOrder.total.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setReorderModalOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmReorder}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrdersPage;
