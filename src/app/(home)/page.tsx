'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Stack,
  Avatar,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Paper,
  TextField,
  InputAdornment,
  Rating,
  Grid
} from '@mui/material';
import {
  SearchOutlined,
  LocalShippingOutlined,
  SecurityOutlined,
  SupportAgentOutlined,
  ArrowForwardOutlined,
  PlayArrowOutlined,
  ShoppingBagOutlined,
  FavoriteOutlined,
  VisibilityOutlined,
  VerifiedUserOutlined,
  FlashOnOutlined
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { formatNumber } from '@/lib/utils';

const HeroSection = () => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        minHeight: '80vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.4,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Ccircle cx="7" cy="7" r="7"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}
      />
      
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
          <Box flex={1}>
            <Stack spacing={3}>
              <Chip
                icon={<FlashOnOutlined />}
                label="New Marketplace Experience"
                color="primary"
                variant="outlined"
                sx={{ alignSelf: 'flex-start' }}
              />
              
              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Discover Amazing Products from Local Shops
              </Typography>
              
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 500 }}
              >
                Shop from thousands of local vendors, discover unique products, and support your community - all in one place.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/products"
                  endIcon={<ArrowForwardOutlined />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`
                  }}
                >
                  Start Shopping
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrowOutlined />}
                  sx={{ py: 1.5, px: 4, borderRadius: 3 }}
                >
                  Watch Demo
                </Button>
              </Stack>
              
              {/* Quick Stats */}
              <Stack direction="row" spacing={4} mt={4}>
                <Stack alignItems="center">
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    500+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Shops
                  </Typography>
                </Stack>
                <Stack alignItems="center">
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    10K+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Products
                  </Typography>
                </Stack>
                <Stack alignItems="center">
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    50K+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Happy Customers
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>
          
          <Box flex={1}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              {/* Hero Image Placeholder */}
              <Box
                sx={{
                  width: { xs: 300, md: 500 },
                  height: { xs: 300, md: 400 },
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`
                }}
              >
                <Stack alignItems="center" spacing={2}>
                  <ShoppingBagOutlined
                    sx={{ fontSize: 100, color: alpha(theme.palette.primary.main, 0.5) }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    Hero Image
                  </Typography>
                </Stack>
              </Box>
              
              {/* Floating Cards */}
              <Card
                sx={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  p: 2,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                  borderRadius: 2
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <VerifiedUserOutlined color="success" />
                  <Typography variant="body2" fontWeight="bold">
                    Trusted Sellers
                  </Typography>
                </Stack>
              </Card>
              
              <Card
                sx={{
                  position: 'absolute',
                  bottom: 40,
                  left: 20,
                  p: 2,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                  borderRadius: 2
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocalShippingOutlined color="primary" />
                  <Typography variant="body2" fontWeight="bold">
                    Fast Delivery
                  </Typography>
                </Stack>
              </Card>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

const SearchSection = () => {
  const theme = useTheme();
  
  return (
    <Container maxWidth="md" sx={{ mt: -4, position: 'relative', zIndex: 1 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
          bgcolor: 'background.paper'
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" textAlign="center" fontWeight="bold">
            What are you looking for?
          </Typography>
          
          <TextField
            fullWidth
            placeholder="Search for products, shops, or categories..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button variant="contained" sx={{ borderRadius: 2 }}>
                    Search
                  </Button>
                </InputAdornment>
              ),
              sx: { borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.02) }
            }}
          />
          
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
            {['Electronics', 'Fashion', 'Home & Garden', 'Books', 'Sports'].map((category) => (
              <Chip
                key={category}
                label={category}
                variant="outlined"
                clickable
                sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
              />
            ))}
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: SecurityOutlined,
      title: 'Secure Shopping',
      description: 'Your payments and personal data are protected with bank-level security',
      color: 'success'
    },
    {
      icon: LocalShippingOutlined,
      title: 'Fast Delivery',
      description: 'Get your orders delivered quickly with our reliable shipping partners',
      color: 'primary'
    },
    {
      icon: SupportAgentOutlined,
      title: '24/7 Support',
      description: 'Our customer support team is always ready to help you with any questions',
      color: 'secondary'
    },
    {
      icon: VerifiedUserOutlined,
      title: 'Quality Guarantee',
      description: 'All products go through quality checks to ensure you get the best',
      color: 'info'
    }
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <Box textAlign="center">
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Why Choose ShopSphere?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              We provide everything you need for a seamless and enjoyable shopping experience
            </Typography>
          </Box>
          
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ flexWrap: 'wrap' }}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 12px)' } }}>
                  <Card
                    sx={{
                      p: 3,
                      height: '100%',
                      textAlign: 'center',
                      borderRadius: 3,
                      border: `1px solid ${alpha('#000', 0.05)}`,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 16px 48px ${alpha('#000', 0.1)}`
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: `${feature.color}.main`
                      }}
                    >
                      <IconComponent sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Card>
                </Box>
              );
            })}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

const FeaturedProductsSection = () => {
  const theme = useTheme();
  
  const featuredProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 89.99,
      originalPrice: 119.99,
      image: '/placeholder.png',
      rating: 4.5,
      reviews: 128,
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      originalPrice: 249.99,
      image: '/placeholder.png',
      rating: 4.8,
      reviews: 94,
      badge: 'New'
    },
    {
      id: 3,
      name: 'Laptop Backpack',
      price: 49.99,
      originalPrice: 69.99,
      image: '/placeholder.png',
      rating: 4.3,
      reviews: 76,
      badge: 'Sale'
    },
    {
      id: 4,
      name: 'Coffee Maker',
      price: 129.99,
      originalPrice: 159.99,
      image: '/placeholder.png',
      rating: 4.6,
      reviews: 203,
      badge: 'Popular'
    }
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Featured Products
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Discover our hand-picked selection of amazing products
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardOutlined />}
              component={Link}
              href="/products"
            >
              View All
            </Button>
          </Stack>
          
          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 32px ${alpha(theme.palette.common.black, 0.15)}`
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover'
                      }}
                    />
                    
                    {/* Product Badge */}
                    <Chip
                      label={product.badge}
                      size="small"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        fontWeight: 'bold'
                      }}
                    />
                    
                    {/* Action Buttons */}
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '.MuiCard-root:hover &': { opacity: 1 }
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'grey.100' } }}
                      >
                        <FavoriteOutlined fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'grey.100' } }}
                      >
                        <VisibilityOutlined fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                  
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom noWrap>
                      {product.name}
                    </Typography>
                    
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <Rating value={product.rating} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary">
                        ({product.reviews})
                      </Typography>
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        ₦{formatNumber(product.price.toFixed(0))}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        ₦{formatNumber(product.originalPrice.toFixed(0))}
                      </Typography>
                      <Chip
                        label={`${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    </Stack>
                    
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ShoppingBagOutlined />}
                      sx={{ borderRadius: 2 }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

const CategoriesSection = () => {
  const categories = [
    { name: 'Electronics', icon: '📱', count: '2.5K+ Products' },
    { name: 'Fashion', icon: '👗', count: '1.8K+ Products' },
    { name: 'Home & Garden', icon: '🏠', count: '3.2K+ Products' },
    { name: 'Books', icon: '📚', count: '950+ Products' },
    { name: 'Sports', icon: '⚽', count: '1.2K+ Products' },
    { name: 'Beauty', icon: '💄', count: '800+ Products' },
    { name: 'Automotive', icon: '🚗', count: '650+ Products' },
    { name: 'Toys', icon: '🧸', count: '1.1K+ Products' }
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Shop by Category
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Explore our wide range of categories
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          {categories.map((category, index) => (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 1.5 }} key={index}>
              <Card
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${alpha('#000', 0.1)}`
                  }
                }}
              >
                <Typography sx={{ fontSize: '2rem', mb: 1 }}>
                  {category.icon}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {category.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {category.count}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default function Home() {
  const { status, data } = useSession();

  return (
    <Box>
      <HeroSection />
      <SearchSection />
      <FeaturesSection />
      <FeaturedProductsSection />
      <CategoriesSection />
      
      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Debug Info</Typography>
            <Typography variant="body2">Status: {status}</Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              User: {JSON.stringify(data?.user)}
            </Typography>
          </Paper>
        </Container>
      )}
    </Box>
  );
}
