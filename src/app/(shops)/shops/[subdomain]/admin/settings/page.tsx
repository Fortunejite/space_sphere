'use client';

import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  IconButton,
  alpha,
  useTheme,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  SaveOutlined,
  PhotoCameraOutlined,
  EditOutlined,
  DeleteOutlined,
  AddOutlined,
  SecurityOutlined,
  PaymentOutlined,
  LocalShippingOutlined,
  NotificationsOutlined,
  StoreOutlined,
  BusinessOutlined,
  LocationOnOutlined,
  PhoneOutlined,
  EmailOutlined,
  LanguageOutlined
} from '@mui/icons-material';
import { useState } from 'react';

// Mock data
const shopSettings = {
  basic: {
    name: 'TechHub Store',
    description: 'Your one-stop shop for premium electronics and tech accessories',
    logo: '/placeholder.png',
    banner: '/placeholder.png',
    subdomain: 'techhub',
    category: 'Electronics',
    phone: '+234 123 456 7890',
    email: 'info@techhub.com',
    address: '123 Tech Street, Victoria Island, Lagos, Nigeria',
    currency: 'NGN',
    timezone: 'Africa/Lagos',
    language: 'en'
  },
  social: {
    website: 'https://techhub.com',
    facebook: 'https://facebook.com/techhub',
    instagram: 'https://instagram.com/techhub',
    twitter: 'https://twitter.com/techhub',
    youtube: 'https://youtube.com/techhub'
  },
  business: {
    businessName: 'TechHub Limited',
    businessRegNumber: 'RC123456',
    taxNumber: 'TIN123456789',
    businessType: 'limited_company',
    businessAddress: '123 Corporate Drive, Victoria Island, Lagos',
    bankName: 'First Bank',
    accountNumber: '1234567890',
    accountName: 'TechHub Limited'
  },
  shipping: {
    freeShippingThreshold: 50000,
    shippingFee: 2500,
    processingTime: '1-2 business days',
    shippingZones: [
      { name: 'Lagos', fee: 2500, duration: '1-2 days' },
      { name: 'Abuja', fee: 3500, duration: '2-3 days' },
      { name: 'Other States', fee: 5000, duration: '3-5 days' }
    ]
  },
  notifications: {
    orderNotifications: true,
    stockAlerts: true,
    promotionUpdates: false,
    customerMessages: true,
    marketingEmails: false
  }
};

const ShopSettings = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('basic');
  const [settings, setSettings] = useState(shopSettings);

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <StoreOutlined /> },
    { id: 'business', label: 'Business', icon: <BusinessOutlined /> },
    { id: 'shipping', label: 'Shipping', icon: <LocalShippingOutlined /> },
    { id: 'payment', label: 'Payment', icon: <PaymentOutlined /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsOutlined /> },
    { id: 'security', label: 'Security', icon: <SecurityOutlined /> }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
  };

  const BasicInfoSection = () => (
    <Stack spacing={4}>
      {/* Shop Identity */}
      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Shop Identity
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Shop Name"
                value={settings.basic.name}
                onChange={(e) => setSettings({
                  ...settings,
                  basic: { ...settings.basic, name: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subdomain"
                value={settings.basic.subdomain}
                InputProps={{
                  endAdornment: <InputAdornment position="end">.shopsphere.com</InputAdornment>
                }}
                onChange={(e) => setSettings({
                  ...settings,
                  basic: { ...settings.basic, subdomain: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Shop Description"
                multiline
                rows={3}
                value={settings.basic.description}
                onChange={(e) => setSettings({
                  ...settings,
                  basic: { ...settings.basic, description: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={settings.basic.category}
                  label="Category"
                  onChange={(e) => setSettings({
                    ...settings,
                    basic: { ...settings.basic, category: e.target.value }
                  })}
                >
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Fashion">Fashion</MenuItem>
                  <MenuItem value="Home & Garden">Home & Garden</MenuItem>
                  <MenuItem value="Sports">Sports</MenuItem>
                  <MenuItem value="Books">Books</MenuItem>
                  <MenuItem value="Health & Beauty">Health & Beauty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Media */}
      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Shop Media
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Shop Logo
                </Typography>
                <Stack direction="row" alignItems="center" spacing={3}>
                  <Avatar
                    src={settings.basic.logo}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      border: `2px solid ${theme.palette.divider}`
                    }}
                  >
                    <StoreOutlined sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Stack spacing={1}>
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCameraOutlined />}
                      size="small"
                    >
                      Change Logo
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                      Recommended: 200x200px, PNG or JPG
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Shop Banner
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 120,
                    borderRadius: 2,
                    border: `2px dashed ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: `url(${settings.basic.banner})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<PhotoCameraOutlined />}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: theme.palette.background.paper
                      }
                    }}
                  >
                    Change Banner
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Recommended: 1200x400px, PNG or JPG
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Contact Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={settings.basic.phone}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PhoneOutlined /></InputAdornment>
                }}
                onChange={(e) => setSettings({
                  ...settings,
                  basic: { ...settings.basic, phone: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={settings.basic.email}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmailOutlined /></InputAdornment>
                }}
                onChange={(e) => setSettings({
                  ...settings,
                  basic: { ...settings.basic, email: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Address"
                multiline
                rows={2}
                value={settings.basic.address}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LocationOnOutlined /></InputAdornment>
                }}
                onChange={(e) => setSettings({
                  ...settings,
                  basic: { ...settings.basic, address: e.target.value }
                })}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Social Media Links
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website"
                value={settings.social.website}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LanguageOutlined /></InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Facebook"
                value={settings.social.facebook}
                placeholder="https://facebook.com/yourpage"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Instagram"
                value={settings.social.instagram}
                placeholder="https://instagram.com/yourpage"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Twitter"
                value={settings.social.twitter}
                placeholder="https://twitter.com/yourpage"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );

  const BusinessSection = () => (
    <Stack spacing={4}>
      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Business Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Legal Business Name"
                value={settings.business.businessName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Business Type</InputLabel>
                <Select
                  value={settings.business.businessType}
                  label="Business Type"
                >
                  <MenuItem value="sole_proprietorship">Sole Proprietorship</MenuItem>
                  <MenuItem value="partnership">Partnership</MenuItem>
                  <MenuItem value="limited_company">Limited Company</MenuItem>
                  <MenuItem value="corporation">Corporation</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Business Registration Number"
                value={settings.business.businessRegNumber}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tax Identification Number"
                value={settings.business.taxNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Address"
                multiline
                rows={2}
                value={settings.business.businessAddress}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Banking Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bank Name"
                value={settings.business.bankName}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Account Number"
                value={settings.business.accountNumber}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Account Name"
                value={settings.business.accountName}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );

  const ShippingSection = () => (
    <Stack spacing={4}>
      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Shipping Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Free Shipping Threshold"
                type="number"
                value={settings.shipping.freeShippingThreshold}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₦</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Default Shipping Fee"
                type="number"
                value={settings.shipping.shippingFee}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₦</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Processing Time"
                value={settings.shipping.processingTime}
                placeholder="e.g., 1-2 business days"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight={600}>
              Shipping Zones
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddOutlined />}
              size="small"
            >
              Add Zone
            </Button>
          </Stack>
          <List>
            {settings.shipping.shippingZones.map((zone, index) => (
              <ListItem
                key={index}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  mb: 2
                }}
              >
                <ListItemText
                  primary={zone.name}
                  secondary={
                    <Stack direction="row" spacing={2} mt={1}>
                      <Chip
                        label={`₦${zone.fee}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={zone.duration}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton size="small">
                    <EditOutlined />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteOutlined />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );

  const NotificationsSection = () => (
    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Notification Preferences
        </Typography>
        <Stack spacing={3}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.orderNotifications}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, orderNotifications: e.target.checked }
                })}
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2">Order Notifications</Typography>
                <Typography variant="caption" color="text.secondary">
                  Get notified when you receive new orders
                </Typography>
              </Box>
            }
          />
          <Divider />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.stockAlerts}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, stockAlerts: e.target.checked }
                })}
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2">Stock Alerts</Typography>
                <Typography variant="caption" color="text.secondary">
                  Get alerted when products are running low
                </Typography>
              </Box>
            }
          />
          <Divider />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.customerMessages}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, customerMessages: e.target.checked }
                })}
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2">Customer Messages</Typography>
                <Typography variant="caption" color="text.secondary">
                  Get notified of customer inquiries and messages
                </Typography>
              </Box>
            }
          />
          <Divider />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.marketingEmails}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, marketingEmails: e.target.checked }
                })}
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2">Marketing Emails</Typography>
                <Typography variant="caption" color="text.secondary">
                  Receive updates about new features and promotions
                </Typography>
              </Box>
            }
          />
        </Stack>
      </CardContent>
    </Card>
  );

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'basic': return <BasicInfoSection />;
      case 'business': return <BusinessSection />;
      case 'shipping': return <ShippingSection />;
      case 'notifications': return <NotificationsSection />;
      default: return <BasicInfoSection />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Shop Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure your shop preferences and business information
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveOutlined />}
          onClick={handleSave}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Save Changes
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden'
            }}
          >
            <List sx={{ p: 0 }}>
              {tabs.map((tab) => (
                <ListItem
                  key={tab.id}
                  button
                  onClick={() => handleTabChange(tab.id)}
                  sx={{
                    py: 2,
                    px: 3,
                    backgroundColor: activeTab === tab.id 
                      ? alpha(theme.palette.primary.main, 0.1) 
                      : 'transparent',
                    borderLeft: activeTab === tab.id 
                      ? `4px solid ${theme.palette.primary.main}` 
                      : '4px solid transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  <Box sx={{ mr: 2, color: activeTab === tab.id ? 'primary.main' : 'text.secondary' }}>
                    {tab.icon}
                  </Box>
                  <ListItemText
                    primary={tab.label}
                    primaryTypographyProps={{
                      fontWeight: activeTab === tab.id ? 600 : 500,
                      color: activeTab === tab.id ? 'primary.main' : 'text.primary'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Content */}
        <Grid item xs={12} md={9}>
          {renderActiveSection()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShopSettings;
