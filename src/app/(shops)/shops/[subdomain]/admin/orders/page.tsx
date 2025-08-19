'use client';

import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  alpha,
  useTheme,
  Checkbox,
  Toolbar,
  Tooltip
} from '@mui/material';
import {
  SearchOutlined,
  FilterListOutlined,
  MoreVertOutlined,
  VisibilityOutlined,
  EditOutlined,
  DeleteOutlined,
  LocalShippingOutlined,
  CheckCircleOutlined,
  CancelOutlined,
  PendingOutlined,
  DownloadOutlined,
  RefreshOutlined,
  AddOutlined,
  PrintOutlined,
  EmailOutlined,
  PersonOutlined,
  ShoppingBagOutlined,
  CalendarTodayOutlined,
  AttachMoneyOutlined
} from '@mui/icons-material';
import { useState } from 'react';

// Mock data
const orders = [
  {
    id: 'ORD-001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/placeholder.png'
    },
    date: '2024-01-15',
    status: 'completed',
    total: 125000,
    items: 3,
    paymentMethod: 'Card',
    shippingAddress: '123 Main St, Lagos, Nigeria'
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: '/placeholder.png'
    },
    date: '2024-01-14',
    status: 'processing',
    total: 85000,
    items: 2,
    paymentMethod: 'Transfer',
    shippingAddress: '456 Oak Ave, Abuja, Nigeria'
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: '/placeholder.png'
    },
    date: '2024-01-13',
    status: 'pending',
    total: 67000,
    items: 1,
    paymentMethod: 'Card',
    shippingAddress: '789 Pine St, Port Harcourt, Nigeria'
  },
  {
    id: 'ORD-004',
    customer: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: '/placeholder.png'
    },
    date: '2024-01-12',
    status: 'shipped',
    total: 92000,
    items: 4,
    paymentMethod: 'Transfer',
    shippingAddress: '321 Elm St, Kano, Nigeria'
  },
  {
    id: 'ORD-005',
    customer: {
      name: 'David Brown',
      email: 'david@example.com',
      avatar: '/placeholder.png'
    },
    date: '2024-01-11',
    status: 'cancelled',
    total: 45000,
    items: 2,
    paymentMethod: 'Card',
    shippingAddress: '654 Maple Ave, Ibadan, Nigeria'
  }
];

const statusTabs = [
  { label: 'All Orders', value: 'all', count: 156 },
  { label: 'Pending', value: 'pending', count: 23 },
  { label: 'Processing', value: 'processing', count: 45 },
  { label: 'Shipped', value: 'shipped', count: 67 },
  { label: 'Completed', value: 'completed', count: 18 },
  { label: 'Cancelled', value: 'cancelled', count: 3 }
];

const OrdersManagement = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<typeof orders[0] | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = orders.map((order) => order.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, orderId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(orderId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleViewOrder = () => {
    const order = orders.find(o => o.id === selectedOrder);
    setOrderDetails(order!);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const getStatusColor = (status: string = 'processing') => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'pending': return 'warning';
      case 'shipped': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string = 'processing') => {
    switch (status) {
      case 'completed': return <CheckCircleOutlined fontSize="small" />;
      case 'processing': return <PendingOutlined fontSize="small" />;
      case 'pending': return <PendingOutlined fontSize="small" />;
      case 'shipped': return <LocalShippingOutlined fontSize="small" />;
      case 'cancelled': return <CancelOutlined fontSize="small" />;
      default: return <PendingOutlined fontSize="small" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || order.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Orders Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all your customer orders
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<DownloadOutlined />}
            sx={{ borderRadius: 2 }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            sx={{ borderRadius: 2 }}
          >
            Add Order
          </Button>
        </Stack>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <ShoppingBagOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    156
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                  <AttachMoneyOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    ₦2.4M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                  <PendingOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    23
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Orders
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                  <CalendarTodayOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    18
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Today&apos;s Orders
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden'
        }}
      >
        {/* Tabs */}
        <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontWeight: 600
              }
            }}
          >
            {statusTabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span>{tab.label}</span>
                    <Chip
                      label={tab.count}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 20,
                        '& .MuiChip-label': { fontSize: '0.75rem', px: 1 }
                      }}
                    />
                  </Stack>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/* Search and Actions */}
        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <TextField
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                )
              }}
              sx={{ flex: 1 }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterListOutlined />}
              sx={{ borderRadius: 2 }}
            >
              Filter
            </Button>
            <IconButton>
              <RefreshOutlined />
            </IconButton>
          </Stack>

          {/* Bulk Actions */}
          {selected.length > 0 && (
            <Toolbar
              sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 2,
                mb: 2
              }}
            >
              <Typography
                sx={{ flex: '1 1 100%' }}
                color="inherit"
                variant="subtitle1"
                component="div"
              >
                {selected.length} selected
              </Typography>
              <Tooltip title="Mark as shipped">
                <IconButton>
                  <LocalShippingOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print labels">
                <IconButton>
                  <PrintOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Send email">
                <IconButton>
                  <EmailOutlined />
                </IconButton>
              </Tooltip>
            </Toolbar>
          )}

          {/* Orders Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={selected.length > 0 && selected.length < orders.length}
                      checked={orders.length > 0 && selected.length === orders.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => {
                    const isItemSelected = isSelected(order.id);
                    return (
                      <TableRow
                        key={order.id}
                        hover
                        onClick={(event) => handleClick(event, order.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        selected={isItemSelected}
                        sx={{
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.04)
                          }
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {order.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                              src={order.customer.avatar}
                              sx={{ width: 32, height: 32 }}
                            >
                              <PersonOutlined />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {order.customer.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {order.customer.email}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(order.date).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            size="small"
                            color={getStatusColor(order.status) as 'success' | 'info' | 'warning' | 'primary' | 'error' | 'default'}
                            variant="outlined"
                            icon={getStatusIcon(order.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {order.items} items
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>
                            ₦{order.total.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuOpen(e, order.id);
                            }}
                          >
                            <MoreVertOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            minWidth: 200
          }
        }}
      >
        <MenuItem onClick={handleViewOrder}>
          <ListItemIcon>
            <VisibilityOutlined fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditOutlined fontSize="small" />
          </ListItemIcon>
          Edit Order
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <LocalShippingOutlined fontSize="small" />
          </ListItemIcon>
          Mark as Shipped
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <PrintOutlined fontSize="small" />
          </ListItemIcon>
          Print Invoice
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteOutlined fontSize="small" color="error" />
          </ListItemIcon>
          Cancel Order
        </MenuItem>
      </Menu>

      {/* Order Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              Order Details - {orderDetails?.id}
            </Typography>
            <Chip
              label={orderDetails?.status}
              color={getStatusColor(orderDetails?.status) as 'success' | 'info' | 'warning' | 'primary' | 'error' | 'default'}
              variant="outlined"
              icon={getStatusIcon(orderDetails?.status)}
            />
          </Stack>
        </DialogTitle>
        <DialogContent>
          {orderDetails && (
            <Grid container spacing={3}>
              <Grid size={{xs: 12, md: 6}}>
                <Box mb={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Customer Information
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <Avatar src={orderDetails.customer.avatar}>
                      <PersonOutlined />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {orderDetails.customer.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {orderDetails.customer.email}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Shipping Address:</strong><br />
                    {orderDetails.shippingAddress}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{xs: 12, md: 6}}>
                <Box mb={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Order Information
                  </Typography>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Order Date:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {new Date(orderDetails.date).toLocaleDateString()}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Payment Method:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {orderDetails.paymentMethod}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Items:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {orderDetails.items} items
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Total:</Typography>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        ₦{orderDetails.total.toLocaleString()}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
          <Button variant="contained" startIcon={<PrintOutlined />}>
            Print Invoice
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersManagement;
