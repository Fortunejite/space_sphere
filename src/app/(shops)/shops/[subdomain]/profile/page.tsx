'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  Avatar,
  Typography,
  Stack,
  Divider,
  TextField,
  Grid,
  IconButton,
  Badge,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Paper,
  alpha,
  useTheme,
  useMediaQuery,
  Theme,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  EditOutlined,
  CameraAltOutlined,
  LocationOnOutlined,
  EmailOutlined,
  PhoneOutlined,
  CalendarTodayOutlined,
  ShoppingBagOutlined,
  FavoriteOutlined,
  StarOutlined,
  VisibilityOutlined,
  DeleteOutlined,
  SecurityOutlined,
  NotificationsOutlined,
  LogoutOutlined,
  VerifiedUserOutlined,
  TrendingUpOutlined,
  LocalShippingOutlined,
  PaymentOutlined
} from '@mui/icons-material';
import { useState } from 'react';
import { formatNumber } from '@/lib/utils';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 812 345 6789',
    address: '123 Victoria Island, Lagos, Nigeria',
    bio: 'Passionate online shopper and tech enthusiast.',
    joinDate: 'January 2024',
    avatar: '/placeholder.png'
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSaveProfile = () => {
    setEditMode(false);
    // Save profile logic here
  };

  // Mock data
  const stats = {
    totalOrders: 24,
    totalSpent: 450000,
    wishlistItems: 12,
    reviewsWritten: 18,
    loyaltyPoints: 2340
  };

  const recentOrders = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 45000,
      items: 3,
      shop: 'TechHub Store'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'Processing',
      total: 28000,
      items: 2,
      shop: 'Fashion Central'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      date: '2024-01-25',
      status: 'Shipped',
      total: 67000,
      items: 4,
      shop: 'Home Essentials'
    }
  ];

  const wishlistItems = [
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 35000,
      image: '/placeholder.png',
      shop: 'Audio Store',
      inStock: true
    },
    {
      id: '2',
      name: 'Smart Watch',
      price: 85000,
      image: '/placeholder.png',
      shop: 'Tech World',
      inStock: false
    },
    {
      id: '3',
      name: 'Running Shoes',
      price: 42000,
      image: '/placeholder.png',
      shop: 'Sports Arena',
      inStock: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Processing': return 'warning';
      case 'Shipped': return 'info';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02), minHeight: '100vh', py: 4 }}>
      <Box maxWidth="1200px" mx="auto" px={{ xs: 2, sm: 4 }}>
        {/* Profile Header */}
        <Card sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
          <Box
            sx={{
              height: 200,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              position: 'relative'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                bottom: -60,
                left: { xs: '50%', md: 40 },
                transform: { xs: 'translateX(-50%)', md: 'none' }
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <CameraAltOutlined fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar
                  src={profileData.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    border: `4px solid ${theme.palette.background.paper}`,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`
                  }}
                />
              </Badge>
            </Box>
          </Box>
          
          <CardContent sx={{ pt: { xs: 8, md: 4 }, pb: 3 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={3}
              alignItems={{ xs: 'center', md: 'flex-start' }}
              sx={{ mt: { xs: 0, md: 4 } }}
            >
              <Box flex={1} textAlign={{ xs: 'center', md: 'left' }} sx={{ ml: { md: 20 } }}>
                <Stack direction="row" alignItems="center" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <Typography variant="h4" fontWeight="bold">
                    {profileData.name}
                  </Typography>
                  <Chip
                    icon={<VerifiedUserOutlined />}
                    label="Verified"
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </Stack>
                <Typography variant="body1" color="text.secondary" mt={1}>
                  {profileData.bio}
                </Typography>
                <Stack direction="row" spacing={3} mt={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <Stack alignItems="center">
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {stats.totalOrders}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Orders
                    </Typography>
                  </Stack>
                  <Stack alignItems="center">
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      ₦{formatNumber(stats.totalSpent.toFixed(0))}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Spent
                    </Typography>
                  </Stack>
                  <Stack alignItems="center">
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {stats.loyaltyPoints}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Points
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
              
              <Stack direction={{ xs: 'row', md: 'column' }} spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<EditOutlined />}
                  onClick={() => setEditMode(true)}
                  fullWidth={isMobile}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SecurityOutlined />}
                  fullWidth={isMobile}
                >
                  Security
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Card sx={{ borderRadius: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              sx={{ px: 3 }}
            >
              <Tab label="Overview" icon={<TrendingUpOutlined />} iconPosition="start" />
              <Tab label="Orders" icon={<ShoppingBagOutlined />} iconPosition="start" />
              <Tab label="Wishlist" icon={<FavoriteOutlined />} iconPosition="start" />
              <Tab label="Reviews" icon={<StarOutlined />} iconPosition="start" />
              <Tab label="Settings" icon={<SecurityOutlined />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Overview Tab */}
          <TabPanel value={activeTab} index={0}>
            <Box p={3}>
              <Grid container spacing={3}>
                {/* Quick Stats */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Account Overview
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                        <ShoppingBagOutlined color="primary" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {stats.totalOrders}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Orders
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                        <PaymentOutlined color="success" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h5" fontWeight="bold">
                          ₦{formatNumber((stats.totalSpent / 1000).toFixed(0))}K
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Spent
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                        <FavoriteOutlined color="error" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {stats.wishlistItems}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Wishlist Items
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                        <StarOutlined color="warning" sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {stats.reviewsWritten}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Reviews Written
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Recent Orders
                  </Typography>
                  <List>
                    {recentOrders.slice(0, 3).map((order) => (
                      <ListItem key={order.id} divider>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <ShoppingBagOutlined />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {order.orderNumber}
                              </Typography>
                              <Chip
                                label={order.status}
                                size="small"
                                color={getStatusColor(order.status) as any}
                                variant="outlined"
                              />
                            </Stack>
                          }
                          secondary={
                            <Stack spacing={0.5}>
                              <Typography variant="body2" color="text.secondary">
                                {order.shop} • {order.items} items
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {order.date}
                              </Typography>
                            </Stack>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Typography variant="h6" fontWeight="bold">
                            ₦{formatNumber(order.total.toFixed(0))}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    View All Orders
                  </Button>
                </Grid>

                {/* Loyalty Points */}
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), height: 'fit-content' }}>
                    <Stack alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                        <StarOutlined sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Typography variant="h4" fontWeight="bold" color="primary.main">
                        {stats.loyaltyPoints}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold" textAlign="center">
                        Loyalty Points
                      </Typography>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Earn points with every purchase and redeem for exclusive rewards
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={75}
                        sx={{ width: '100%', height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        160 points to next reward
                      </Typography>
                      <Button variant="contained" size="small" fullWidth>
                        Redeem Points
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Orders Tab */}
          <TabPanel value={activeTab} index={1}>
            <Box p={3}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Order History
              </Typography>
              <List>
                {recentOrders.map((order) => (
                  <ListItem key={order.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getStatusColor(order.status) + '.main' }}>
                        <LocalShippingOutlined />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {order.orderNumber}
                          </Typography>
                          <Chip
                            label={order.status}
                            size="small"
                            color={getStatusColor(order.status) as any}
                          />
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="body2">
                            {order.shop} • {order.items} items • ₦{formatNumber(order.total.toFixed(0))}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Ordered on {order.date}
                          </Typography>
                        </Stack>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Stack spacing={1}>
                        <Button size="small" variant="outlined">
                          View Details
                        </Button>
                        {order.status === 'Delivered' && (
                          <Button size="small" variant="contained">
                            Reorder
                          </Button>
                        )}
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          </TabPanel>

          {/* Wishlist Tab */}
          <TabPanel value={activeTab} index={2}>
            <Box p={3}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                My Wishlist ({wishlistItems.length})
              </Typography>
              <Grid container spacing={2}>
                {wishlistItems.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: '100%',
                            height: 160,
                            objectFit: 'cover'
                          }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'background.paper'
                          }}
                          size="small"
                        >
                          <DeleteOutlined fontSize="small" />
                        </IconButton>
                        {!item.inStock && (
                          <Chip
                            label="Out of Stock"
                            color="error"
                            size="small"
                            sx={{
                              position: 'absolute',
                              bottom: 8,
                              left: 8
                            }}
                          />
                        )}
                      </Box>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" noWrap>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.shop}
                        </Typography>
                        <Typography variant="h6" color="primary.main" fontWeight="bold" mt={1}>
                          ₦{formatNumber(item.price.toFixed(0))}
                        </Typography>
                        <Stack direction="row" spacing={1} mt={2}>
                          <Button
                            variant="contained"
                            size="small"
                            disabled={!item.inStock}
                            fullWidth
                          >
                            Add to Cart
                          </Button>
                          <IconButton size="small">
                            <VisibilityOutlined />
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          {/* Reviews Tab */}
          <TabPanel value={activeTab} index={3}>
            <Box p={3}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                My Reviews ({stats.reviewsWritten})
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Your reviews help other customers make informed decisions. Keep writing great reviews!
              </Alert>
              {/* Review content would go here */}
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  Reviews feature coming soon...
                </Typography>
              </Box>
            </Box>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={activeTab} index={4}>
            <Box p={3}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Account Settings
              </Typography>
              <Stack spacing={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <NotificationsOutlined color="primary" />
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Notification Preferences
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Manage your email and SMS notifications
                        </Typography>
                      </Box>
                      <Button variant="outlined">
                        Configure
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <SecurityOutlined color="primary" />
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Privacy & Security
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Password, two-factor authentication, and privacy settings
                        </Typography>
                      </Box>
                      <Button variant="outlined">
                        Manage
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <PaymentOutlined color="primary" />
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Payment Methods
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Manage your saved payment methods and billing addresses
                        </Typography>
                      </Box>
                      <Button variant="outlined">
                        Edit
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                <Divider />

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlined />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Delete Account
                </Button>
              </Stack>
            </Box>
          </TabPanel>
        </Card>

        {/* Edit Profile Dialog */}
        <Dialog open={editMode} onClose={() => setEditMode(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
              <TextField
                fullWidth
                label="Phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              />
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle color="error.main">Delete Account</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This action cannot be undone. All your data will be permanently deleted.
            </Alert>
            <Typography>
              Are you sure you want to delete your account? This will permanently remove all your orders, 
              wishlist items, and account data.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error">
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ProfilePage;
