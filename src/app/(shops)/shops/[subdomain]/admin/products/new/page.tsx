'use client';

import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Card,
  CardMedia,
  alpha,
  useTheme,
  InputAdornment,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBackOutlined,
  SaveOutlined,
  PhotoOutlined,
  DeleteOutlined,
  AddOutlined,
  PreviewOutlined,
} from '@mui/icons-material';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux.hook';
import axios from 'axios';
import Image from 'next/image';
import { useSnackbar } from '@/context/snackbar';

interface ProductFormErrors {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
  categories?: string;
  mainPic?: string;
  saleEnd?: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  categories: string[];
  tags: string[];
  variants: Array<{
    attributes: { [key: string]: string };
    isDefault: boolean;
  }>;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  shippingClass?: string;
  taxClass?: string;
  discount: number;
  saleStart?: Date;
  saleEnd?: Date;
  isFeatured: boolean;
  status: 'active' | 'draft' | 'archived';
  mainPic: string;
  thumbnails: string[];
}

const NewProductPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const { shop } = useAppSelector((state) => state.shop);
  const { categories: allCategories } = useAppSelector((state) => state.category);

  const categories = allCategories.find((cat) => cat._id === shop?.category)?.subcategories || [];

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    stock: 0,
    categories: [],
    tags: [],
    variants: [],
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    shippingClass: 'standard',
    taxClass: 'general',
    discount: 0,
    saleStart: undefined,
    saleEnd: undefined,
    isFeatured: false,
    status: 'draft',
    mainPic: '',
    thumbnails: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [newVariant, setNewVariant] = useState({
    attributes: {} as { [key: string]: string },
    attributeName: '',
    attributeValue: '',
  });
  const { setMessage, setIsOpen } = useSnackbar();

  const handleInputChange = (field: keyof ProductFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown; type?: string; checked?: boolean } }
  ) => {
    const target = event.target;
    const value = 'type' in target && target.type === 'checkbox' 
      ? ('checked' in target ? target.checked : false)
      : target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof ProductFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  }, [tagInput, formData.tags]);

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // For now, we'll just simulate image upload
    // In a real app, you'd upload to a cloud storage service
    const newImages = files.map((file) => 
      URL.createObjectURL(file) // This is just for demo - use proper image upload
    );

    if (newImages.length > 0) {
      setFormData(prev => ({
        ...prev,
        mainPic: prev.mainPic || newImages[0], // Set first image as main if no main pic
        thumbnails: [...prev.thumbnails, ...newImages]
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    const allImages = [formData.mainPic, ...formData.thumbnails].filter(Boolean);
    const imageToRemove = allImages[index];
    
    if (imageToRemove === formData.mainPic) {
      // If removing main pic, set first thumbnail as main pic
      setFormData(prev => ({
        ...prev,
        mainPic: prev.thumbnails[0] || '',
        thumbnails: prev.thumbnails.slice(1)
      }));
    } else {
      // Remove from thumbnails
      setFormData(prev => ({
        ...prev,
        thumbnails: prev.thumbnails.filter(img => img !== imageToRemove)
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ProductFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (formData.categories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }

    if (!formData.mainPic) {
      newErrors.mainPic = 'Main product image is required';
    }

    // Validate sale dates
    if (formData.saleStart && formData.saleEnd && formData.saleStart >= formData.saleEnd) {
      newErrors.saleEnd = 'Sale end date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!validateForm() || !shop) return;

    setLoading(true);
    
    try {
      const productData = {
        ...formData,
        status: isDraft ? 'draft' : formData.status,
      };

      await axios.post(`/api/shops/${shop.subdomain}/admin/products`, productData);
      setMessage(`Product ${isDraft ? 'saved as draft' : 'created'} successfully!`)
      setIsOpen(true);

      // Redirect after short delay
      setTimeout(() => {
        router.push(`/shops/${shop.subdomain}/admin/products`);
      }, 1500);

    } catch (error: unknown) {
      console.error('Error creating product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      setMessage(errorMessage)
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // You could open a modal or navigate to a preview page
    console.log('Preview product:', formData);
  };

  // Variant management functions
  const handleAddVariantAttribute = () => {
    if (newVariant.attributeName.trim() && newVariant.attributeValue.trim()) {
      setNewVariant(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [prev.attributeName.toLowerCase()]: prev.attributeValue
        },
        attributeName: '',
        attributeValue: ''
      }));
    }
  };

  const handleRemoveVariantAttribute = (key: string) => {
    setNewVariant(prev => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...remainingAttributes } = prev.attributes;
      return {
        ...prev,
        attributes: remainingAttributes
      };
    });
  };

  const handleAddVariant = () => {
    if (Object.keys(newVariant.attributes).length > 0) {
      const isFirstVariant = formData.variants.length === 0;
      setFormData(prev => ({
        ...prev,
        variants: [
          ...prev.variants,
          {
            attributes: newVariant.attributes,
            isDefault: isFirstVariant // First variant is default
          }
        ]
      }));
      
      // Reset new variant form
      setNewVariant({
        attributes: {},
        attributeName: '',
        attributeValue: ''
      });
    }
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => {
      const newVariants = prev.variants.filter((_, i) => i !== index);
      // If we removed the default variant and there are still variants, make the first one default
      if (prev.variants[index].isDefault && newVariants.length > 0) {
        newVariants[0] = { ...newVariants[0], isDefault: true };
      }
      return {
        ...prev,
        variants: newVariants
      };
    });
  };

  const handleSetDefaultVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => ({
        ...variant,
        isDefault: i === index
      }))
    }));
  };

  if (!shop) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={() => router.back()}>
            <ArrowBackOutlined />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Create New Product
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Add a new product to your catalog
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<PreviewOutlined />}
            onClick={handlePreview}
            disabled={!formData.name || !formData.description}
          >
            Preview
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleSubmit(true)}
            disabled={loading}
          >
            Save Draft
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveOutlined />}
            onClick={() => handleSubmit(false)}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Publish'}
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={4}>
        {/* Main Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={4}>
            {/* Basic Information */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Basic Information
              </Typography>
              
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Product Name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />

                <TextField
                  fullWidth
                  label="Description"
                  placeholder="Enter product description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                />

                <FormControl fullWidth error={!!errors.categories} required>
                  <InputLabel>Categories</InputLabel>
                  <Select
                    multiple
                    value={formData.categories}
                    label="Categories"
                    onChange={handleInputChange('categories')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const category = categories.find(cat => cat._id.toString() === value);
                          return <Chip key={value} label={category?.name || value} size="small" />;
                        })}
                      </Box>
                    )}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id.toString()} value={category._id.toString()}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6}}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                      <Select
                        value={formData.currency}
                        label="Currency"
                        onChange={handleInputChange('currency')}
                      >
                        <MenuItem value="USD">USD ($)</MenuItem>
                        <MenuItem value="NGN">NGN (₦)</MenuItem>
                        <MenuItem value="EUR">EUR (€)</MenuItem>
                        <MenuItem value="GBP">GBP (£)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>                <Grid size={{ xs: 12, md: 6}}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.status}
                        label="Status"
                        onChange={handleInputChange('status')}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="archived">Archived</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>

            {/* Pricing & Inventory */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Pricing & Inventory
              </Typography>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange('price')}
                    error={!!errors.price}
                    helperText={errors.price}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">
                        {formData.currency === 'NGN' ? '₦' : formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : '£'}
                      </InputAdornment>,
                    }}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Discount (%)"
                    type="number"
                    value={formData.discount}
                    onChange={handleInputChange('discount')}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange('stock')}
                    error={!!errors.stock}
                    helperText={errors.stock}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Weight (grams)"
                    type="number"
                    value={formData.weight || ''}
                    onChange={handleInputChange('weight')}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Sale Period (Optional)
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Sale Start Date"
                    type="datetime-local"
                    value={formData.saleStart ? new Date(formData.saleStart).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      saleStart: e.target.value ? new Date(e.target.value) : undefined 
                    }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Sale End Date"
                    type="datetime-local"
                    value={formData.saleEnd ? new Date(formData.saleEnd).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      saleEnd: e.target.value ? new Date(e.target.value) : undefined 
                    }))}
                    error={!!errors.saleEnd}
                    helperText={errors.saleEnd}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Shipping & Dimensions */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Shipping & Dimensions
              </Typography>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Shipping Class</InputLabel>
                    <Select
                      value={formData.shippingClass || 'standard'}
                      label="Shipping Class"
                      onChange={handleInputChange('shippingClass')}
                    >
                      <MenuItem value="standard">Standard</MenuItem>
                      <MenuItem value="express">Express</MenuItem>
                      <MenuItem value="overnight">Overnight</MenuItem>
                      <MenuItem value="free">Free Shipping</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Tax Class</InputLabel>
                    <Select
                      value={formData.taxClass || 'general'}
                      label="Tax Class"
                      onChange={handleInputChange('taxClass')}
                    >
                      <MenuItem value="general">General</MenuItem>
                      <MenuItem value="reduced">Reduced Rate</MenuItem>
                      <MenuItem value="digital">Digital Goods</MenuItem>
                      <MenuItem value="exempt">Tax Exempt</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Length (cm)"
                    type="number"
                    value={formData.dimensions?.length || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dimensions: {
                        ...prev.dimensions,
                        length: parseFloat(e.target.value) || undefined
                      }
                    }))}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Width (cm)"
                    type="number"
                    value={formData.dimensions?.width || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dimensions: {
                        ...prev.dimensions,
                        width: parseFloat(e.target.value) || undefined
                      }
                    }))}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Height (cm)"
                    type="number"
                    value={formData.dimensions?.height || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dimensions: {
                        ...prev.dimensions,
                        height: parseFloat(e.target.value) || undefined
                      }
                    }))}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Product Images */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Product Images
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                First image will be set as main product image
              </Typography>
              
              <Grid container spacing={2}>
                {[formData.mainPic, ...formData.thumbnails].filter(Boolean).map((image, index) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                    <Card elevation={0} sx={{ position: 'relative', border: `1px solid ${theme.palette.divider}` }}>
                      {index === 0 && (
                        <Chip
                          label="Main"
                          size="small"
                          color="primary"
                          sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
                        />
                      )}
                      <CardMedia
                        component={Image}
                        height={120}
                        image={image}
                        alt={`Product image ${index + 1}`}
                        width={200}
                        style={{ objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255,255,255,0.8)',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                        }}
                      >
                        <DeleteOutlined fontSize="small" />
                      </IconButton>
                    </Card>
                  </Grid>
                ))}
                
                {/* Add Image Button */}
                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px dashed ${theme.palette.divider}`,
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      }
                    }}
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Stack alignItems="center" spacing={1}>
                      <PhotoOutlined color="action" />
                      <Typography variant="caption" color="text.secondary">
                        Add Image
                      </Typography>
                    </Stack>
                  </Card>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </Grid>
              </Grid>
              {errors.mainPic && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.mainPic}
                </Typography>
              )}
            </Paper>

            {/* Tags */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Tags
              </Typography>
              
              <Stack spacing={2}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    placeholder="Add tags to help customers find your product"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<AddOutlined />}
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    Add
                  </Button>
                </Stack>
                
                {formData.tags.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                )}
              </Stack>
            </Paper>

            {/* Product Variants */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Product Variants
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add variants like size, color, material, etc. to offer different options of your product.
              </Typography>
              
              {/* Variant List */}
              {formData.variants.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  {formData.variants.map((variant, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{ 
                        p: 3, 
                        mb: 2, 
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        bgcolor: variant.isDefault ? alpha(theme.palette.primary.main, 0.05) : 'transparent'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Variant {index + 1}
                          </Typography>
                          {variant.isDefault && (
                            <Chip label="Default" size="small" color="primary" />
                          )}
                        </Box>
                        <Box>
                          {!variant.isDefault && (
                            <Button
                              size="small"
                              onClick={() => handleSetDefaultVariant(index)}
                              sx={{ mr: 1 }}
                            >
                              Set as Default
                            </Button>
                          )}
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveVariant(index)}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Grid container spacing={2}>
                        {Object.entries(variant.attributes).map(([key, value]) => (
                          <Grid size={{xs: 6, sm: 4}} key={key}>
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                {key.toUpperCase()}
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {value}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  ))}
                </Box>
              )}

              {/* Add New Variant */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: `2px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Add New Variant
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{xs: 12, sm: 6}}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Attribute Name"
                      placeholder="e.g., Size, Color, Material"
                      value={newVariant.attributeName}
                      onChange={(e) => setNewVariant(prev => ({
                        ...prev,
                        attributeName: e.target.value
                      }))}
                    />
                  </Grid>
                  <Grid size={{xs: 12, sm: 6}}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Attribute Value"
                      placeholder="e.g., Large, Red, Cotton"
                      value={newVariant.attributeValue}
                      onChange={(e) => setNewVariant(prev => ({
                        ...prev,
                        attributeValue: e.target.value
                      }))}
                    />
                  </Grid>
                </Grid>

                {/* Current Variant Attributes */}
                {Object.keys(newVariant.attributes).length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Current Attributes:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {Object.entries(newVariant.attributes).map(([key, value]) => (
                        <Chip
                          key={key}
                          label={`${key}: ${value}`}
                          onDelete={() => handleRemoveVariantAttribute(key)}
                          size="small"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="outlined"
                    startIcon={<AddOutlined />}
                    onClick={handleAddVariantAttribute}
                    disabled={!newVariant.attributeName.trim() || !newVariant.attributeValue.trim()}
                  >
                    Add Attribute
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleAddVariant}
                    disabled={Object.keys(newVariant.attributes).length === 0}
                  >
                    Create Variant
                  </Button>
                </Stack>
              </Paper>
            </Paper>
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={4}>
            {/* Publishing Options */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Publishing Options
              </Typography>
              
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFeatured}
                      onChange={handleInputChange('isFeatured')}
                    />
                  }
                  label="Featured Product"
                />
              </Stack>
            </Paper>

            {/* Product Preview */}
            {(formData.name || formData.description) && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Preview
                </Typography>
                
                <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                  {(formData.mainPic || formData.thumbnails[0]) && (
                    <CardMedia
                      component={Image}
                      height={140}
                      image={formData.mainPic || formData.thumbnails[0]}
                      alt="Product preview"
                      width={300}
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {formData.name || 'Product Name'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {formData.description || 'Product description'}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        {formData.currency === 'NGN' ? '₦' : formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : '£'}
                        {formData.price.toLocaleString() || '0'}
                      </Typography>
                      {formData.discount > 0 && (
                        <Chip label={`${formData.discount}% OFF`} color="error" size="small" />
                      )}
                    </Stack>
                    {formData.isFeatured && (
                      <Chip label="Featured" color="warning" size="small" sx={{ mt: 1 }} />
                    )}
                  </Box>
                </Card>
              </Paper>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewProductPage;
