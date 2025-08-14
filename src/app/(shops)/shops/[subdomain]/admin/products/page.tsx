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
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Pagination,
  alpha,
  useTheme,
  Avatar,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction
} from '@mui/material';
import {
  SearchOutlined,
  FilterListOutlined,
  MoreVertOutlined,
  EditOutlined,
  DeleteOutlined,
  VisibilityOutlined,
  AddOutlined,
  UploadOutlined,
  DownloadOutlined,
  ContentCopyOutlined,
  InventoryOutlined,
  TrendingUpOutlined,
  VisibilityOffOutlined,
  StarOutlined,
  ShoppingCartOutlined,
  CategoryOutlined,
  AttachMoneyOutlined
} from '@mui/icons-material';
import { useState } from 'react';

// Mock data
const products = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 25000,
    originalPrice: 30000,
    category: 'Electronics',
    brand: 'TechCorp',
    stock: 45,
    status: 'active',
    sales: 234,
    revenue: 5850000,
    rating: 4.5,
    reviews: 89,
    image: '/placeholder.png',
    featured: true,
    createdAt: '2024-01-10',
    tags: ['wireless', 'bluetooth', 'audio']
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring',
    price: 45000,
    originalPrice: 50000,
    category: 'Electronics',
    brand: 'FitTech',
    stock: 28,
    status: 'active',
    sales: 156,
    revenue: 7020000,
    rating: 4.7,
    reviews: 67,
    image: '/placeholder.png',
    featured: false,
    createdAt: '2024-01-08',
    tags: ['fitness', 'smartwatch', 'health']
  },
  {
    id: 3,
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable cotton t-shirt',
    price: 8000,
    originalPrice: 10000,
    category: 'Fashion',
    brand: 'EcoWear',
    stock: 0,
    status: 'out_of_stock',
    sales: 89,
    revenue: 712000,
    rating: 4.2,
    reviews: 34,
    image: '/placeholder.png',
    featured: false,
    createdAt: '2024-01-05',
    tags: ['organic', 'cotton', 'sustainable']
  },
  {
    id: 4,
    name: 'Professional Laptop Stand',
    description: 'Ergonomic aluminum laptop stand for better posture',
    price: 15000,
    originalPrice: 18000,
    category: 'Accessories',
    brand: 'WorkFlow',
    stock: 67,
    status: 'active',
    sales: 123,
    revenue: 1845000,
    rating: 4.6,
    reviews: 45,
    image: '/placeholder.png',
    featured: true,
    createdAt: '2024-01-03',
    tags: ['laptop', 'stand', 'ergonomic']
  },
  {
    id: 5,
    name: 'Smart Home Security Camera',
    description: '1080p HD security camera with night vision',
    price: 35000,
    originalPrice: 40000,
    category: 'Electronics',
    brand: 'SecureTech',
    stock: 12,
    status: 'low_stock',
    sales: 78,
    revenue: 2730000,
    rating: 4.3,
    reviews: 23,
    image: '/placeholder.png',
    featured: false,
    createdAt: '2024-01-01',
    tags: ['security', 'camera', 'smart home']
  },
  {
    id: 6,
    name: 'Premium Coffee Beans',
    description: 'Single-origin arabica coffee beans, medium roast',
    price: 12000,
    originalPrice: 15000,
    category: 'Food & Beverage',
    brand: 'BrewMaster',
    stock: 89,
    status: 'active',
    sales: 167,
    revenue: 2004000,
    rating: 4.8,
    reviews: 92,
    image: '/placeholder.png',
    featured: true,
    createdAt: '2023-12-28',
    tags: ['coffee', 'premium', 'arabica']
  }
];

const categories = ['All', 'Electronics', 'Fashion', 'Accessories', 'Food & Beverage', 'Home & Garden'];
const statusOptions = ['All', 'Active', 'Out of Stock', 'Low Stock', 'Draft'];

const ProductsManagement = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const itemsPerPage = 12;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, productId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(productId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'out_of_stock': return 'error';
      case 'low_stock': return 'warning';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'out_of_stock': return 'Out of Stock';
      case 'low_stock': return 'Low Stock';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || 
      (selectedStatus === 'Active' && product.status === 'active') ||
      (selectedStatus === 'Out of Stock' && product.status === 'out_of_stock') ||
      (selectedStatus === 'Low Stock' && product.status === 'low_stock') ||
      (selectedStatus === 'Draft' && product.status === 'draft');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'price': return a.price - b.price;
      case 'sales': return b.sales - a.sales;
      case 'stock': return b.stock - a.stock;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  const paginatedProducts = sortedProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const speedDialActions = [
    { icon: <AddOutlined />, name: 'Add Product', action: () => setEditDialogOpen(true) },
    { icon: <UploadOutlined />, name: 'Import Products', action: () => {} },
    { icon: <DownloadOutlined />, name: 'Export Products', action: () => {} },
    { icon: <CategoryOutlined />, name: 'Manage Categories', action: () => {} }
  ];

  const ProductCard = ({ product }: { product: typeof products[0] }) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
          borderColor: theme.palette.primary.main
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
          sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
        />
        {product.featured && (
          <Chip
            label="Featured"
            size="small"
            color="primary"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontWeight: 600
            }}
          />
        )}
        <Chip
          label={getStatusLabel(product.status)}
          size="small"
          color={getStatusColor(product.status) as 'success' | 'error' | 'warning' | 'default'}
          variant="outlined"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'white'
          }}
        />
        <IconButton
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            backgroundColor: 'white',
            '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
          }}
          onClick={(e) => handleMenuOpen(e, product.id)}
        >
          <MoreVertOutlined />
        </IconButton>
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
          {product.description}
        </Typography>
        
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <StarOutlined sx={{ fontSize: 16, color: 'warning.main' }} />
          <Typography variant="body2" fontWeight={600}>
            {product.rating}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({product.reviews} reviews)
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight={700} color="primary">
              ₦{product.price.toLocaleString()}
            </Typography>
            {product.originalPrice > product.price && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ₦{product.originalPrice.toLocaleString()}
              </Typography>
            )}
          </Box>
          <Chip
            label={`${product.stock} in stock`}
            size="small"
            variant="outlined"
            color={product.stock > 20 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="caption" color="text.secondary">
              {product.sales} sales
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              ₦{product.revenue.toLocaleString()}
            </Typography>
          </Box>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <TrendingUpOutlined sx={{ fontSize: 16, color: 'success.main' }} />
            <Typography variant="caption" color="success.main" fontWeight={600}>
              +12%
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Products Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your product catalog and inventory
          </Typography>
        </Box>
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
                  <InventoryOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {products.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Products
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
                    ₦24.1M
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
                  <VisibilityOffOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {products.filter(p => p.status === 'out_of_stock').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Out of Stock
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
                  <ShoppingCartOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    1,247
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Sales
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
          p: 3,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          mb: 3
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{xs: 12, md: 4}}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 2}}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 2}}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedStatus}
                label="Status"
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 2}}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="sales">Sales</MenuItem>
                <MenuItem value="stock">Stock</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 2}}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<FilterListOutlined />}
                fullWidth
              >
                Filter
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Grid */}
      <Box mb={4}>
        <Stack direction="row" alignItems="center" justifyContent="between" mb={3}>
          <Typography variant="h6" fontWeight={600}>
            {sortedProducts.length} Products Found
          </Typography>
        </Stack>
        
        <Grid container spacing={3}>
          {paginatedProducts.map((product) => (
            <Grid size={{xs: 12, sm: 6, md: 4, lg: 3}} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Stack alignItems="center" mt={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, newPage) => setPage(newPage)}
              color="primary"
              size="large"
            />
          </Stack>
        )}
      </Box>

      {/* Speed Dial */}
      <SpeedDial
        ariaLabel="Product actions"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        icon={<SpeedDialIcon />}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>

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
        <MenuItem onClick={() => { setEditDialogOpen(true); handleMenuClose(); }}>
          <ListItemIcon>
            <EditOutlined fontSize="small" />
          </ListItemIcon>
          Edit Product
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <VisibilityOutlined fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ContentCopyOutlined fontSize="small" />
          </ListItemIcon>
          Duplicate
        </MenuItem>
        <MenuItem onClick={() => { setDeleteDialogOpen(true); handleMenuClose(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteOutlined fontSize="small" color="error" />
          </ListItemIcon>
          Delete Product
        </MenuItem>
      </Menu>

      {/* Edit Product Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Product Name"
                placeholder="Enter product name"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                placeholder="Enter product description"
                multiline
                rows={3}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                placeholder="0"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₦</InputAdornment>
                }}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                placeholder="0"
              />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label="Category">
                  {categories.slice(1).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <TextField
                fullWidth
                label="Brand"
                placeholder="Enter brand name"
              />
            </Grid>
            <Grid size={12}>
              <FormControlLabel
                control={<Switch />}
                label="Featured Product"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            {selectedProduct ? 'Update' : 'Create'} Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Delete Product
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this product? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsManagement;
