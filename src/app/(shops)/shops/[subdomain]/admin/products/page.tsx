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
  FormControl,
  InputLabel,
  Select,
  alpha,
  useTheme,
  Avatar,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  CircularProgress,
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
  VisibilityOffOutlined,
  StarOutlined,
  ShoppingCartOutlined,
  AttachMoneyOutlined,
  RefreshOutlined,
} from '@mui/icons-material';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useAppSelector } from '@/hooks/redux.hook';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ProductWithCategoryAndReviews } from '@/types/product';
import { useSnackbar } from '@/context/snackbar';
import ProductCardSkeleton from './productSkeleton';
import { formatCurrency } from '@/lib/currency';

interface ProductsResponse {
  products: ProductWithCategoryAndReviews[];
  totalCount: number;
  hasMore: boolean;
}

interface LoadingStates {
  initial: boolean;
  loadMore: boolean;
  delete: string | null;
  duplicate: string | null;
  toggleStatus: string | null;
}

const statusOptions = ['All', 'Active', 'Out of Stock', 'Low Stock', 'Draft'];
const productLimit = 10;

const ProductsManagement = () => {
  const theme = useTheme();
  const router = useRouter();
  const { shop } = useAppSelector((state) => state.shop);
  const { categories: allCategories } = useAppSelector(
    (state) => state.category,
  );

  const categories = useMemo(
    () =>
      allCategories.find((cat) => cat._id === shop?.category)?.subcategories ||
      [],
    [allCategories, shop],
  );

  // State
  const [products, setProducts] = useState<ProductWithCategoryAndReviews[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Loading states
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    initial: true,
    loadMore: false,
    delete: null,
    duplicate: null,
    toggleStatus: null,
  });

  // UI states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithCategoryAndReviews | null>(null);
  const { setMessage, setIsOpen } = useSnackbar();

  // Refs for infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch products function
  const fetchProducts = useCallback(
    async (reset = false) => {
      if (!shop) return;

      const currentPage = reset
        ? 1
        : Math.ceil(products.length / productLimit) + 1;

      if (reset) {
        setLoadingStates((prev) => ({ ...prev, initial: true }));
      } else {
        setLoadingStates((prev) => ({ ...prev, loadMore: true }));
      }

      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: productLimit.toString(),
        });

        if (searchTerm) params.set('search', searchTerm);
        if (selectedCategory !== 'All')
          params.set('category', selectedCategory);
        if (selectedStatus !== 'All')
          params.set('status', selectedStatus.toLowerCase().replace(' ', '_'));
        if (sortBy) params.set('sort', sortBy);

        const response = await axios.get<ProductsResponse>(
          `/api/shops/${shop.subdomain}/admin/products`,
          { params },
        );

        const {
          products: newProducts,
          totalCount: newTotalCount,
          hasMore: moreAvailable,
        } = response.data;

        if (reset) {
          setProducts(newProducts || []);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }

        setTotalCount(newTotalCount);
        setHasMore(moreAvailable);
      } catch (error) {
        console.error('Error fetching products:', error);
        setMessage('Failed to load products');
        setIsOpen(true);
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          initial: false,
          loadMore: false,
        }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      shop,
      searchTerm,
      selectedCategory,
      selectedStatus,
      sortBy,
      products.length,
    ],
  );

  // Load more products
  const loadMoreProducts = useCallback(() => {
    if (!loadingStates.loadMore && hasMore) {
      fetchProducts(false);
    }
  }, [loadingStates.loadMore, hasMore, fetchProducts]);

  const lastProductElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loadingStates.loadMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingStates.loadMore, hasMore, loadMoreProducts],
  );

  // Initial load and filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(true);
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, selectedStatus, sortBy]);

  // Menu handlers
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    product: ProductWithCategoryAndReviews,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  // Product operations
  const handleDeleteProduct = async () => {
    if (!selectedProduct || !shop) return;

    setLoadingStates((prev) => ({ ...prev, delete: selectedProduct.slug }));

    try {
      await axios.delete(
        `/api/shops/${shop.subdomain}/admin/products/${selectedProduct.slug}`,
      );

      setProducts((prev) =>
        prev.filter((p) => p.slug !== selectedProduct.slug),
      );
      setTotalCount((prev) => prev - 1);

      setMessage('Product deleted successfully');
      setIsOpen(true);
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage('Failed to delete product');
      setIsOpen(true);
    } finally {
      setLoadingStates((prev) => ({ ...prev, delete: null }));
      handleMenuClose();
    }
  };

  const handleDuplicateProduct = async () => {
    if (!selectedProduct || !shop) return;

    setLoadingStates((prev) => ({ ...prev, duplicate: selectedProduct._id }));

    try {
      const response = await axios.post(
        `/api/shops/${shop.subdomain}/admin/products/${selectedProduct.slug}/duplicate`,
      );
      const newProduct = response.data;

      setProducts((prev) => [newProduct, ...prev]);
      setTotalCount((prev) => prev + 1);

      setMessage('Product duplicated successfully');
      setIsOpen(true);
    } catch (error) {
      console.error('Error duplicating product:', error);
      setMessage('Failed to duplicate product');
      setIsOpen(true);
    } finally {
      setLoadingStates((prev) => ({ ...prev, duplicate: null }));
      handleMenuClose();
    }
  };

  const handleToggleProductStatus = async () => {
    if (!selectedProduct || !shop) return;

    const newStatus = selectedProduct.status === 'active' ? 'draft' : 'active';
    setLoadingStates((prev) => ({
      ...prev,
      toggleStatus: selectedProduct._id,
    }));

    try {
      await axios.patch(
        `/api/shops/${shop.subdomain}/admin/products/${selectedProduct.slug}/status`,
        {
          status: newStatus,
        },
      );

      setProducts((prev) =>
        prev.map((p) =>
          p._id === selectedProduct._id ? { ...p, status: newStatus } : p,
        ),
      );

      setMessage(
        `Product ${
          newStatus === 'active' ? 'activated' : 'deactivated'
        } successfully`,
      );
      setIsOpen(true);
    } catch (error) {
      console.error('Error toggling product status:', error);
      setMessage('Failed to update product status');
      setIsOpen(true);
    } finally {
      setLoadingStates((prev) => ({ ...prev, toggleStatus: null }));
      handleMenuClose();
    }
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'out_of_stock':
        return 'error';
      case 'low_stock':
        return 'warning';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'out_of_stock':
        return 'Out of Stock';
      case 'low_stock':
        return 'Low Stock';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  const speedDialActions = [
    {
      icon: <AddOutlined />,
      name: 'Add Product',
      action: () => router.push(`/shops/${shop?.subdomain}/admin/products/new`),
    },
    {
      icon: <UploadOutlined />,
      name: 'Import Products',
      action: () => console.log('Import products'),
    },
    {
      icon: <DownloadOutlined />,
      name: 'Export Products',
      action: () => console.log('Export products'),
    },
    {
      icon: <RefreshOutlined />,
      name: 'Refresh',
      action: () => fetchProducts(true),
    },
  ];

  const ProductCard = ({
    product,
    isLast,
  }: {
    product: ProductWithCategoryAndReviews;
    isLast?: boolean;
  }) => {
    const discountPrice =
      product.discount > 0
        ? product.price - (product.price * product.discount) / 100
        : null;
    const averageRating =
      product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      (product.reviews.length || 1);
    return (
      <Card
        ref={isLast ? lastProductElementRef : undefined}
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          opacity: loadingStates.delete === product._id ? 0.5 : 1,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={product.mainPic?.[0] || '/placeholder.png'}
            alt={product.name}
            sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
          />
          {product.isFeatured && (
            <Chip
              label="Featured"
              size="small"
              color="primary"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                fontWeight: 600,
              }}
            />
          )}
          <Chip
            label={getStatusLabel(product.status)}
            size="small"
            color={
              getStatusColor(product.status) as
                | 'success'
                | 'error'
                | 'warning'
                | 'default'
            }
            variant="outlined"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: 'white',
            }}
          />
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
            onClick={(e) => handleMenuOpen(e, product)}
            disabled={
              !!loadingStates.delete ||
              !!loadingStates.duplicate ||
              !!loadingStates.toggleStatus
            }
          >
            {loadingStates.delete === product._id ||
            loadingStates.duplicate === product._id ||
            loadingStates.toggleStatus === product._id ? (
              <CircularProgress size={20} />
            ) : (
              <MoreVertOutlined />
            )}
          </IconButton>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, minHeight: 40 }}
          >
            {product.description}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <StarOutlined sx={{ fontSize: 16, color: 'warning.main' }} />
            <Typography variant="body2" fontWeight={600}>
              {averageRating}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({product.reviews?.length || 0} reviews)
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={700} color="primary">
                {formatCurrency(discountPrice || product.price, shop?.currency)}
              </Typography>
              {discountPrice && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {formatCurrency(product.price, shop?.currency)}
                </Typography>
              )}
            </Box>
            <Chip
              label={`${product.stock} in stock`}
              size="small"
              variant="outlined"
              color={
                product.stock > 20
                  ? 'success'
                  : product.stock > 0
                  ? 'warning'
                  : 'error'
              }
            />
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Total sales
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {product.salesCount || 0}
              </Typography>
            </Box>
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                router.push(
                  `/shops/${shop?.subdomain}/admin/products/${product.slug}/edit`,
                )
              }
            >
              Edit
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  if (!shop) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            Products Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your product catalog and inventory ({totalCount} products)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() =>
            router.push(`/shops/${shop.subdomain}/admin/products/new`)
          }
          sx={{ borderRadius: 3 }}
        >
          Add Product
        </Button>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1,
              )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <InventoryOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {shop.stats?.totalProducts || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Products
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
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.success.main,
                0.1,
              )} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                  <AttachMoneyOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {shop.stats?.activeProducts || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Products
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
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.warning.main,
                0.1,
              )} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                  <VisibilityOffOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {products.filter((p) => p.stock === 0).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Out of Stock
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
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.info.main,
                0.1,
              )} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                  <ShoppingCartOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {shop.stats?.totalSales || 0}
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
          mb: 3,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
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
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
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
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
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
                <MenuItem value="created">Date Created</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterListOutlined />}
              fullWidth
              onClick={() => fetchProducts(true)}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Grid */}
      <Box mb={4}>
        {loadingStates.initial ? (
          <Grid container spacing={3}>
            {Array.from({
              length: Math.min(shop.stats?.totalProducts, productLimit),
            }).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <ProductCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : products.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 2,
            }}
          >
            <InventoryOutlined
              sx={{
                fontSize: 80,
                color: 'text.disabled',
                mb: 2,
              }}
            />
            <Typography variant="h6" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
              {searchTerm ||
              selectedCategory !== 'All' ||
              selectedStatus !== 'All'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by adding your first product.'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() =>
                router.push(`/shops/${shop.subdomain}/admin/products/new`)
              }
            >
              Add First Product
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {products.map((product, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product._id}>
                  <ProductCard
                    product={product}
                    isLast={index === products.length - 1}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Load More Indicator */}
            {loadingStates.loadMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {/* End of Results */}
            {!hasMore && products.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 4, py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  You&apos;ve reached the end of your products
                </Typography>
              </Box>
            )}
          </>
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
            minWidth: 200,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            if (selectedProduct) {
              router.push(
                `/shops/${shop.subdomain}/admin/products/${selectedProduct.slug}/edit`,
              );
            }
          }}
        >
          <ListItemIcon>
            <EditOutlined fontSize="small" />
          </ListItemIcon>
          Edit Product
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            if (selectedProduct) {
              router.push(
                `/shops/${shop.subdomain}/admin/products/${selectedProduct.slug}`,
              );
            }
          }}
        >
          <ListItemIcon>
            <VisibilityOutlined fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem
          onClick={handleDuplicateProduct}
          disabled={!!loadingStates.duplicate}
        >
          <ListItemIcon>
            <ContentCopyOutlined fontSize="small" />
          </ListItemIcon>
          Duplicate
        </MenuItem>
        <MenuItem
          onClick={handleToggleProductStatus}
          disabled={!!loadingStates.toggleStatus}
        >
          <ListItemIcon>
            <VisibilityOffOutlined fontSize="small" />
          </ListItemIcon>
          {selectedProduct?.status === 'active' ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <MenuItem
          onClick={handleDeleteProduct}
          disabled={!!loadingStates.delete}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteOutlined fontSize="small" color="error" />
          </ListItemIcon>
          Delete Product
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProductsManagement;
