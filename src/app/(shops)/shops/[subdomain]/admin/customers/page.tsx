'use client';

import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  TextField,
  InputAdornment,
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
  Chip,
  Grid,
  Card,
  CardContent,
  alpha,
  useTheme,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Rating
} from '@mui/material';
import {
  SearchOutlined,
  FilterListOutlined,
  MoreVertOutlined,
  PersonOutlined,
  EmailOutlined,
  PhoneOutlined,
  LocationOnOutlined,
  ShoppingBagOutlined,
  AttachMoneyOutlined,
  VisibilityOutlined,
  EditOutlined,
  DeleteOutlined,
  BlockOutlined,
  MessageOutlined,
  DownloadOutlined,
  PeopleOutlined,
  TrendingUpOutlined
} from '@mui/icons-material';
import { useState } from 'react';

// Mock data
const customers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 123 456 7890',
    avatar: '/placeholder.png',
    location: 'Lagos, Nigeria',
    joinDate: '2024-01-15',
    lastOrder: '2024-02-10',
    totalOrders: 12,
    totalSpent: 450000,
    averageOrderValue: 37500,
    status: 'active',
    tier: 'gold',
    rating: 4.8,
    reviews: 8
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+234 987 654 3210',
    avatar: '/placeholder.png',
    location: 'Abuja, Nigeria',
    joinDate: '2024-01-08',
    lastOrder: '2024-02-08',
    totalOrders: 8,
    totalSpent: 320000,
    averageOrderValue: 40000,
    status: 'active',
    tier: 'silver',
    rating: 4.5,
    reviews: 5
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+234 555 123 4567',
    avatar: '/placeholder.png',
    location: 'Port Harcourt, Nigeria',
    joinDate: '2024-01-20',
    lastOrder: '2024-01-25',
    totalOrders: 3,
    totalSpent: 125000,
    averageOrderValue: 41667,
    status: 'inactive',
    tier: 'bronze',
    rating: 4.2,
    reviews: 2
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+234 444 789 0123',
    avatar: '/placeholder.png',
    location: 'Kano, Nigeria',
    joinDate: '2023-12-10',
    lastOrder: '2024-02-12',
    totalOrders: 25,
    totalSpent: 875000,
    averageOrderValue: 35000,
    status: 'active',
    tier: 'platinum',
    rating: 4.9,
    reviews: 18
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@example.com',
    phone: '+234 333 456 7890',
    avatar: '/placeholder.png',
    location: 'Ibadan, Nigeria',
    joinDate: '2024-02-01',
    lastOrder: 'Never',
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    status: 'inactive',
    tier: 'bronze',
    rating: 0,
    reviews: 0
  }
];

const customerStats = {
  total: 1247,
  active: 892,
  inactive: 355,
  newThisMonth: 78,
  totalRevenue: 24567000,
  averageOrderValue: 38500
};

const statusTabs = [
  { label: 'All Customers', value: 'all', count: customerStats.total },
  { label: 'Active', value: 'active', count: customerStats.active },
  { label: 'Inactive', value: 'inactive', count: customerStats.inactive },
  { label: 'VIP', value: 'vip', count: 45 }
];

const CustomersManagement = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<typeof customers[0] | null>(null);

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, customerId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customerId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };

  const handleViewCustomer = () => {
    const customer = customers.find(c => c.id === selectedCustomer);
    setCustomerDetails(customer || null);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'blocked': return 'error';
      default: return 'default';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return '#e5e7eb';
      case 'gold': return '#fbbf24';
      case 'silver': return '#9ca3af';
      case 'bronze': return '#d97706';
      default: return theme.palette.grey[400];
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesTab = selectedTab === 'all' || 
      (selectedTab === 'active' && customer.status === 'active') ||
      (selectedTab === 'inactive' && customer.status === 'inactive') ||
      (selectedTab === 'vip' && (customer.tier === 'platinum' || customer.tier === 'gold'));
    return matchesSearch && matchesTab;
  });

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Customers Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your customer relationships and insights
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
            startIcon={<PersonOutlined />}
            sx={{ borderRadius: 2 }}
          >
            Add Customer
          </Button>
        </Stack>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                  <PeopleOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {customerStats.total.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Customers
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                  <TrendingUpOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {customerStats.active.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Customers
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                  <AttachMoneyOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    ₦{(customerStats.totalRevenue / 1000000).toFixed(1)}M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                  <ShoppingBagOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    ₦{customerStats.averageOrderValue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Order Value
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Table */}
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
              placeholder="Search customers by name, email, or phone..."
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
          </Stack>

          {/* Customers Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tier</TableCell>
                  <TableCell align="right">Orders</TableCell>
                  <TableCell align="right">Total Spent</TableCell>
                  <TableCell align="right">Rating</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((customer) => (
                    <TableRow
                      key={customer.id}
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.04)
                        }
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            src={customer.avatar}
                            sx={{ width: 40, height: 40 }}
                          >
                            <PersonOutlined />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {customer.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Joined {new Date(customer.joinDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            {customer.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {customer.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.status}
                          size="small"
                          color={getStatusColor(customer.status) as 'success' | 'default' | 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.tier}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getTierColor(customer.tier), 0.2),
                            color: getTierColor(customer.tier),
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {customer.totalOrders}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          ₦{customer.totalSpent.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="flex-end">
                          <Rating
                            value={customer.rating}
                            readOnly
                            size="small"
                            precision={0.1}
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({customer.reviews})
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, customer.id)}
                        >
                          <MoreVertOutlined />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCustomers.length}
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
        <MenuItem onClick={handleViewCustomer}>
          <ListItemIcon>
            <VisibilityOutlined fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditOutlined fontSize="small" />
          </ListItemIcon>
          Edit Customer
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <MessageOutlined fontSize="small" />
          </ListItemIcon>
          Send Message
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <BlockOutlined fontSize="small" />
          </ListItemIcon>
          Block Customer
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteOutlined fontSize="small" color="error" />
          </ListItemIcon>
          Delete Customer
        </MenuItem>
      </Menu>

      {/* Customer Details Dialog */}
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
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={customerDetails?.avatar}
              sx={{ width: 56, height: 56 }}
            >
              <PersonOutlined />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {customerDetails?.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                  label={customerDetails?.status}
                  size="small"
                  color={getStatusColor(customerDetails?.status || '') as 'success' | 'default' | 'error'}
                  variant="outlined"
                />
                <Chip
                  label={customerDetails?.tier}
                  size="small"
                  sx={{
                    backgroundColor: alpha(getTierColor(customerDetails?.tier || ''), 0.2),
                    color: getTierColor(customerDetails?.tier || ''),
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {customerDetails && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Contact Information
                </Typography>
                <List dense>
                  <ListItem disablePadding>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                        <EmailOutlined color="primary" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={customerDetails.email}
                      secondary="Email Address"
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                        <PhoneOutlined color="primary" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={customerDetails.phone}
                      secondary="Phone Number"
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                        <LocationOnOutlined color="primary" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={customerDetails.location}
                      secondary="Location"
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Purchase History
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Total Orders:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {customerDetails.totalOrders}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Total Spent:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ₦{customerDetails.totalSpent.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Average Order:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ₦{customerDetails.averageOrderValue.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Last Order:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {customerDetails.lastOrder === 'Never' 
                        ? 'Never' 
                        : new Date(customerDetails.lastOrder).toLocaleDateString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Customer Rating:</Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Rating
                        value={customerDetails.rating}
                        readOnly
                        size="small"
                        precision={0.1}
                      />
                      <Typography variant="caption">
                        ({customerDetails.reviews} reviews)
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
          <Button variant="outlined" startIcon={<MessageOutlined />}>
            Send Message
          </Button>
          <Button variant="contained" startIcon={<EditOutlined />}>
            Edit Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomersManagement;
