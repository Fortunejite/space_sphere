'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Alert,
  Skeleton,
  Rating,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Share,
  Star,
  Inventory,
  Visibility,
  ShoppingCart,
  AttachMoney,
  Schedule,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useTheme } from '@mui/material/styles';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  tags: string[];
  images: string[];
  inventory: {
    quantity: number;
    sku: string;
    trackQuantity: boolean;
  };
  seo: {
    title: string;
    description: string;
  };
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  averageRating: number;
  totalReviews: number;
  totalSales: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const productId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);

  // Simulate loading product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock product data - replace with real API call
        const mockProduct: Product = {
          _id: productId,
          name: 'Premium Wireless Headphones',
          description: 'High-quality wireless headphones with active noise cancellation and premium sound quality. Features Bluetooth 5.0 connectivity, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers, professionals, and anyone who demands the best audio experience.',
          price: 299.99,
          compareAtPrice: 399.99,
          category: 'Electronics',
          tags: ['wireless', 'headphones', 'premium', 'noise-cancelling', 'bluetooth'],
          images: ['/placeholder.png', '/placeholder.png', '/placeholder.png'],
          inventory: {
            quantity: 50,
            sku: 'WH-001',
            trackQuantity: true,
          },
          seo: {
            title: 'Premium Wireless Headphones - Best Sound Quality',
            description: 'Premium wireless headphones with advanced noise cancellation technology.',
          },
          status: 'active',
          featured: true,
          averageRating: 4.8,
          totalReviews: 127,
          totalSales: 342,
          views: 1250,
          createdAt: '2025-01-10T10:00:00Z',
          updatedAt: '2025-01-15T14:30:00Z',
        };

        const mockReviews: Review[] = [
          {
            _id: '1',
            customerName: 'John Smith',
            rating: 5,
            comment: 'Amazing sound quality and comfort. Best headphones I\'ve ever owned!',
            date: '2025-01-14T10:00:00Z',
            verified: true,
          },
          {
            _id: '2',
            customerName: 'Sarah Johnson',
            rating: 4,
            comment: 'Great product, noise cancellation works perfectly.',
            date: '2025-01-13T15:30:00Z',
            verified: true,
          },
          {
            _id: '3',
            customerName: 'Mike Davis',
            rating: 5,
            comment: 'Excellent build quality and battery life is outstanding.',
            date: '2025-01-12T09:15:00Z',
            verified: false,
          },
        ];
        
        setProduct(mockProduct);
        setReviews(mockReviews);
      } catch (err) {
        setError('Failed to load product');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'draft': return <Schedule />;
      case 'archived': return <Cancel />;
      default: return <Schedule />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Skeleton variant="rectangular" width={40} height={40} />
          <Skeleton variant="text" width={300} height={40} />
        </Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => router.back()}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'grey.50' },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={600}>
              Product Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SKU: {product.inventory.sku}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Share />}
          >
            Share
          </Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => router.push(`/shops/${params.subdomain}/admin/products/${product.name}/edit`)}
          >
            Edit
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Product Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box
              component="img"
              src={product.images[selectedImage] || '/placeholder.png'}
              alt={product.name}
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                borderRadius: 1,
                mb: 2,
              }}
            />
            <Stack direction="row" spacing={1} justifyContent="center">
              {product.images.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: selectedImage === index ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                />
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 2 }}>
              <Chip
                icon={getStatusIcon(product.status)}
                label={product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                color={getStatusColor(product.status)}
                variant="outlined"
              />
              {product.featured && (
                <Chip
                  icon={<Star />}
                  label="Featured"
                  color="warning"
                  size="small"
                />
              )}
            </Box>

            <Typography variant="h5" fontWeight={600} gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h4" color="primary.main" fontWeight={700}>
                ${product.price}
              </Typography>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  ${product.compareAtPrice}
                </Typography>
              )}
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <Chip
                  label={`${Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF`}
                  color="error"
                  size="small"
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={product.averageRating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                {product.averageRating} ({product.totalReviews} reviews)
              </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              {product.tags.map((tag, index) => (
                <Chip key={index} label={tag} size="small" variant="outlined" />
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Product Stats */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                      <ShoppingCart sx={{ fontSize: 16 }} />
                    </Avatar>
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    {product.totalSales}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Sales
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: theme.palette.success.main, width: 32, height: 32 }}>
                      <Visibility sx={{ fontSize: 16 }} />
                    </Avatar>
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    {product.views}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Views
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 32, height: 32 }}>
                      <Inventory sx={{ fontSize: 16 }} />
                    </Avatar>
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    {product.inventory.quantity}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    In Stock
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: theme.palette.info.main, width: 32, height: 32 }}>
                      <AttachMoney sx={{ fontSize: 16 }} />
                    </Avatar>
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    ${(product.price * product.totalSales).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Revenue
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Product Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Product Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Category"
                  secondary={product.category}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="SKU"
                  secondary={product.inventory.sku}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Inventory"
                  secondary={`${product.inventory.quantity} units in stock`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Created"
                  secondary={new Date(product.createdAt).toLocaleDateString()}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Last Updated"
                  secondary={new Date(product.updatedAt).toLocaleDateString()}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Recent Reviews */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Reviews
            </Typography>
            {reviews.length > 0 ? (
              <List>
                {reviews.map((review) => (
                  <ListItem key={review._id} alignItems="flex-start" sx={{ px: 0 }}>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {review.customerName}
                          </Typography>
                          {review.verified && (
                            <Chip label="Verified" size="small" color="success" />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Rating value={review.rating} size="small" readOnly sx={{ mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {review.comment}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No reviews yet
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
