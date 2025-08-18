'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Fab,
  Paper,
  Skeleton,
} from '@mui/material';
import { Add, Store, Settings, Launch } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/currency';
import { ShopWithOwnerAndStats } from '@/types/shop';
import { useAppSelector } from '@/hooks/redux.hook';
import axios from 'axios';

interface NewShopData {
  name: string;
  subdomain: string;
  category: string;
  currency: string;
  description: string;
}

export default function ShopsPage() {
  const router = useRouter();
  const { categories } = useAppSelector((s) => s.category);

  const [shops, setShops] = useState<ShopWithOwnerAndStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [newShop, setNewShop] = useState<NewShopData>({
    name: '',
    subdomain: '',
    category: '',
    currency: 'USD',
    description: '',
  });

  // Available currencies
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  ];

  useEffect(() => {
    const loadShops = async () => {
      try {
        setLoading(true);

        const res = await axios.get('/api/shops');
        console.log('Loaded shops:', res.data);
        setShops(res.data);
      } catch (err) {
        setError('Failed to load shops');
        console.error('Error loading shops:', err);
      } finally {
        setLoading(false);
      }
    };

    loadShops();
  }, []);

  const handleCreateShop = async () => {
    try {
      setCreating(true);
      setError(null);

      // Validate required fields
      if (!newShop.name.trim()) {
        setError('Shop name is required');
        return;
      }
      if (!newShop.subdomain.trim()) {
        setError('Subdomain is required');
        return;
      }
      if (!newShop.category) {
        setError('Category is required');
        return;
      }
      if (!newShop.currency) {
        setError('Currency is required');
        return;
      }

      // Validate subdomain format
      const subdomainRegex = /^[a-z0-9-]+$/;
      if (!subdomainRegex.test(newShop.subdomain)) {
        setError(
          'Subdomain can only contain lowercase letters, numbers, and hyphens',
        );
        return;
      }

      const res = await axios.post('/api/shops', newShop);
      const createdShop = res.data;

      setShops((prev) => [createdShop, ...prev]);
      setSuccess('Shop created successfully!');
      setCreateDialogOpen(false);

      // Reset form
      setNewShop({
        name: '',
        subdomain: '',
        category: '',
        currency: 'USD',
        description: '',
      });

      // Auto-clear success message
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.issues) {
          const issues = err.response.data.issues
            .map(
              (issue: { path: string; message: string }) =>
                `${issue.path} - ${issue.message}`,
            )
            .join(', ');
          setError(`Validation error: ${issues}`);
        } else {
          setError(err.response?.data?.message || 'Failed to create shop');
          console.error('Error creating shop:', err.response?.data);
        }
      } else {
        setError('Failed to create shop');
        console.error('Error creating shop:', err);
      }
    } finally {
      setCreating(false);
    }
  };

  const formatCurrencyAmount = (amount: number, currency: string) => {
    return formatCurrency(amount, currency);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="circular" width={56} height={56} />
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="rectangular" height={200} />
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={32}
                    sx={{ mt: 2 }}
                  />
                  <Skeleton variant="text" width="40%" height={24} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
            My Shops
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and monitor your online stores
          </Typography>
        </Box>

        <Fab
          color="primary"
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-2px)',
            },
          }}
        >
          <Add />
        </Fab>
      </Box>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {/* Shops Grid */}
      {shops.length === 0 ? (
        <Paper
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
          <Store sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>
            No shops yet
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}
          >
            Create your first shop to start selling products online. It only
            takes a few minutes to get started.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            Create Your First Shop
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {shops.map((shop) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={shop._id.toString()}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Shop Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={shop.logo || ''}
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: 'primary.main',
                          fontSize: '1.5rem',
                          fontWeight: 600,
                        }}
                      >
                        {shop.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600} noWrap>
                          {shop.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shop.subdomain}.shopsphere.com
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={shop.status}
                      size="small"
                      color={
                        shop.status === 'active'
                          ? 'success'
                          : shop.status === 'suspended'
                          ? 'warning'
                          : 'error'
                      }
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>

                  {/* Shop Description */}
                  {shop.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {shop.description}
                    </Typography>
                  )}

                  {/* Stats Grid */}
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 1.5,
                          bgcolor: 'primary.50',
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight={600}
                        >
                          {formatNumber(shop.stats?.totalProducts || 0)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Products
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 1.5,
                          bgcolor: 'success.50',
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="success.main"
                          fontWeight={600}
                        >
                          {formatNumber(shop.stats?.totalOrders || 0)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Orders
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 1.5,
                          bgcolor: 'warning.50',
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="warning.main"
                          fontWeight={600}
                        >
                          {formatCurrencyAmount(
                            (shop.stats?.totalRevenueCents || 0) / 100,
                            shop.currency,
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Revenue
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 1.5,
                          bgcolor: 'info.50',
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="info.main"
                          fontWeight={600}
                        >
                          {formatNumber(shop.stats?.totalCustomers || 0)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Customers
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Settings />}
                    onClick={() =>
                      router.push(`/shops/${shop.subdomain}/admin`)
                    }
                    sx={{ mr: 1 }}
                  >
                    Manage Shop
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Launch />}
                    onClick={() =>
                      window.open(`/shops/${shop.subdomain}`, '_blank')
                    }
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Shop Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => !creating && setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Store />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Create New Shop
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Set up your online store in minutes
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Shop Name"
              value={newShop.name}
              onChange={(e) => {
                const name = e.target.value;
                setNewShop((prev) => ({
                  ...prev,
                  name,
                  // Auto-generate subdomain from name
                  subdomain:
                    prev.subdomain === ''
                      ? name
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, '-')
                          .replace(/-+/g, '-')
                          .replace(/^-|-$/g, '')
                      : prev.subdomain,
                }));
              }}
              fullWidth
              required
              helperText="Choose a memorable name for your shop"
              disabled={creating}
            />

            <TextField
              label="Subdomain"
              value={newShop.subdomain}
              onChange={(e) =>
                setNewShop((prev) => ({
                  ...prev,
                  subdomain: e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, ''),
                }))
              }
              fullWidth
              required
              helperText={
                <Box component="span">
                  Your shop will be available at:{' '}
                  <strong>
                    {newShop.subdomain || 'yourshop'}.shopsphere.com
                  </strong>
                </Box>
              }
              disabled={creating}
            />

            <FormControl fullWidth required disabled={creating}>
              <InputLabel>Category</InputLabel>
              <Select
                value={newShop.category}
                label="Category"
                onChange={(e) =>
                  setNewShop((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category._id.toString()}
                    value={category._id.toString()}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required disabled={creating}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={newShop.currency}
                label="Currency"
                onChange={(e) =>
                  setNewShop((prev) => ({ ...prev, currency: e.target.value }))
                }
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        component="span"
                        sx={{ minWidth: 20, fontWeight: 600 }}
                      >
                        {currency.symbol}
                      </Typography>
                      <Typography component="span">
                        {currency.name} ({currency.code})
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <Box
                component="div"
                sx={{ mt: 1, fontSize: '0.75rem', color: 'warning.main' }}
              >
                ⚠️ Currency cannot be changed after shop creation
              </Box>
            </FormControl>

            <TextField
              label="Description"
              value={newShop.description}
              onChange={(e) =>
                setNewShop((prev) => ({ ...prev, description: e.target.value }))
              }
              fullWidth
              multiline
              rows={3}
              helperText="Describe what you'll be selling (optional)"
              disabled={creating}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setCreateDialogOpen(false)}
            disabled={creating}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateShop}
            disabled={
              creating ||
              !newShop.name ||
              !newShop.subdomain ||
              !newShop.category ||
              !newShop.currency
            }
            startIcon={creating ? <CircularProgress size={16} /> : <Add />}
            sx={{ minWidth: 120 }}
          >
            {creating ? 'Creating...' : 'Create Shop'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
