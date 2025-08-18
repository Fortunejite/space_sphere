'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Skeleton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Preview,
  CloudUpload,
  Delete,
  Add,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux.hook';
import axios from 'axios';
import { ProductWithCategoryAndReviews } from '@/types/product';
import { ICategory } from '@/models/Category.model';

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
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productSlug = params.slug as string;

  const { shop } = useAppSelector((state) => state.shop);
  const { categories: allCategories } = useAppSelector((state) => state.category);

  const categories = allCategories.find((cat) => cat._id === shop?.category)?.subcategories || [];
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  // Product form state
  const [product, setProduct] = useState<ProductWithCategoryAndReviews>({
  } as ProductWithCategoryAndReviews);

  // Variant management state
  const [newVariant, setNewVariant] = useState({
    attributes: {} as { [key: string]: string },
    attributeName: '',
    attributeValue: '',
  });

  // Simulate loading product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!shop) return
      try {
        setLoading(true);
        const res = await axios.get(`/api/shops/${shop.subdomain}/products/${productSlug}`)
        setProduct(res.data);
      } catch (err) {
        setError('Failed to load product');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productSlug) {
      loadProduct();
    }
  }, [productSlug, shop]);

  const handleSave = async () => {
    if (!shop) return
    try {
      setSaving(true);
      setError(null);
      
      // Validate required fields
      if (!product.name.trim()) {
        setError('Product name is required');
        return;
      }
      if (!product.description?.trim()) {
        setError('Product description is required');
        return;
      }
      if (product.price <= 0) {
        setError('Product price must be greater than 0');
        return;
      }
      if (product.categories.length === 0) {
        setError('At least one category is required');
        return;
      }
      if (!product.mainPic) {
        setError('Main product image is required');
        return;
      }

      await axios.patch(`/api/shops/${shop.subdomain}/admin/products/${productSlug}`, product)
      
      setSuccess('Product updated successfully!');
      
      // Auto-clear success message
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      setError('Failed to update product');
      console.error('Error updating product:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!shop) return
    try {
      setSaving(true);
      setError(null);
      
      await axios.delete(`/api/shops/${shop.subdomain}/admin/products/${productSlug}`)
      
      setSuccess('Product deleted successfully!');
      
      // Redirect after successful deletion
      setTimeout(() => {
        router.push(`/shops/${params.subdomain}/admin/products`);
      }, 1000);
      
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    } finally {
      setSaving(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you'd upload to a file service
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setProduct(prev => ({
        ...prev,
        mainPic: prev.mainPic || newImages[0],
        thumbnails: [...prev.thumbnails, ...newImages.slice(prev.mainPic ? 0 : 1)],
      }));
    }
  };

  const removeImage = (index: number) => {
    const allImages = [product.mainPic, ...product.thumbnails].filter(Boolean);
    const imageToRemove = allImages[index];
    
    if (imageToRemove === product.mainPic) {
      // If removing main pic, set first thumbnail as main pic
      setProduct(prev => ({
        ...prev,
        mainPic: prev.thumbnails[0] || '',
        thumbnails: prev.thumbnails.slice(1)
      }));
    } else {
      // Remove from thumbnails
      setProduct(prev => ({
        ...prev,
        thumbnails: prev.thumbnails.filter(img => img !== imageToRemove)
      }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !product.tags.includes(tagInput.trim())) {
      setProduct(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProduct(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Skeleton variant="rectangular" width={40} height={40} />
          <Skeleton variant="text" width={300} height={40} />
        </Box>
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="text" width={200} height={30} />
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Skeleton variant="rectangular" height={300} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Skeleton variant="rectangular" height={300} />
              </Grid>
            </Grid>
          </Box>
        </Paper>
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
              Edit Product
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last updated: {new Date(product.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Preview />}
            onClick={() => setPreviewOpen(true)}
          >
            Preview
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} /> : <Save />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Content */}
      <Paper sx={{ overflow: 'hidden' }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="General" />
            <Tab label="Media" />
            <Tab label="Variants" />
            <Tab label="Inventory" />
            <Tab label="SEO" />
            <Tab label="Advanced" />
          </Tabs>
        </Box>

        {/* General Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Product Name"
                  value={product.name}
                  onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                  fullWidth
                  required
                  helperText="Keep it clear and descriptive"
                />

                <TextField
                  label="Description"
                  value={product.description}
                  onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                  fullWidth
                  multiline
                  rows={6}
                  required
                  helperText="Describe your product's features and benefits"
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Price"
                    type="number"
                    value={product.price}
                    onChange={(e) => setProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: product.currency === 'USD' ? '$' : product.currency === 'NGN' ? '₦' : '€',
                    }}
                  />
                  <TextField
                    label="Discount (%)"
                    type="number"
                    value={product.discount}
                    onChange={(e) => setProduct(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                    helperText="Optional discount percentage"
                  />
                </Box>

                <FormControl fullWidth required>
                  <InputLabel>Categories</InputLabel>
                  <Select
                    multiple
                    value={product.categories}
                    label="Categories"
                    onChange={(e) => setProduct(prev => ({ ...prev, categories: e.target.value as ICategory[] }))}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected).map(({_id, name}) => (
                          <Chip key={_id.toString()} label={name} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id.toString()} value={category._id.toString()}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Tags */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {product.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => removeTag(tag)}
                        size="small"
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button size="small" onClick={addTag} startIcon={<Add />}>
                      Add
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Product Status
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={product.status}
                      label="Status"
                      onChange={(e) => setProduct(prev => ({ 
                        ...prev, 
                        status: e.target.value as 'active' | 'draft' | 'archived' 
                      }))}
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="archived">Archived</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={product.isFeatured}
                        onChange={(e) => setProduct(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      />
                    }
                    label="Featured Product"
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Media Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Product Images
            </Typography>

            <Grid container spacing={2}>
              {[product.mainPic, ...product.thumbnails].filter(Boolean).map((image: string, index: number) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                  <Card>
                    {index === 0 && (
                      <Chip
                        label="Main"
                        size="small"
                        color="primary"
                        sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
                      />
                    )}
                    <Box
                      component="img"
                      src={image}
                      alt={`Product ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                      }}
                    />
                    <CardActions>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeImage(index)}
                      >
                        <Delete />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}

              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                  component="label"
                >
                  <input
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <Box sx={{ textAlign: 'center' }}>
                    <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Upload Images
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Variants Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Product Variants
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Manage product variants like size, color, material, etc.
            </Typography>
            
            {/* Existing variants */}
            {product.variants && product.variants.length > 0 ? (
              <Box sx={{ mb: 3 }}>
                {product.variants.map((variant, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      mb: 2, 
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Variant {index + 1}
                      </Typography>
                      {variant.isDefault && (
                        <Chip label="Default" size="small" color="primary" />
                      )}
                    </Box>
                    
                    <Grid container spacing={2}>
                      {Object.entries(variant.attributes).map(([key, value]) => (
                        <Grid size={{ xs: 6, md: 4 }} key={key}>
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
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                No variants created yet. Add variants to offer different options like size, color, etc.
              </Alert>
            )}

            {/* Add new variant */}
            <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Add New Variant
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Attribute Name"
                    value={newVariant.attributeName}
                    onChange={(e) => setNewVariant(prev => ({ ...prev, attributeName: e.target.value }))}
                    fullWidth
                    helperText="e.g. Color, Size, Material"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Attribute Value"
                    value={newVariant.attributeValue}
                    onChange={(e) => setNewVariant(prev => ({ ...prev, attributeValue: e.target.value }))}
                    fullWidth
                    helperText="e.g. Red, L, Cotton"
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (newVariant.attributeName && newVariant.attributeValue) {
                      const attributeKey = newVariant.attributeName.toLowerCase();
                      const attributeValue = newVariant.attributeValue.trim();
                      
                      // Add to current variant attributes
                      setNewVariant(prev => ({
                        ...prev,
                        attributes: {
                          ...prev.attributes,
                          [attributeKey]: attributeValue,
                        },
                        attributeName: '',
                        attributeValue: '',
                      }));
                    }
                  }}
                  disabled={!newVariant.attributeName || !newVariant.attributeValue}
                >
                  Add Attribute
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (Object.keys(newVariant.attributes).length > 0) {
                      setProduct(prev => ({
                        ...prev,
                        variants: [
                          ...prev.variants,
                          {
                            attributes: new Map(Object.entries(newVariant.attributes)),
                            isDefault: prev.variants.length === 0,
                          },
                        ],
                      }));
                      
                      setNewVariant({
                        attributes: {},
                        attributeName: '',
                        attributeValue: '',
                      });
                    }
                  }}
                  disabled={Object.keys(newVariant.attributes).length === 0}
                >
                  Add Variant
                </Button>
              </Box>

              {/* Show current variant attributes */}
              {Object.keys(newVariant.attributes).length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Current Attributes:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Object.entries(newVariant.attributes).map(([key, value]) => (
                      <Chip
                        key={key}
                        label={`${key}: ${value}`}
                        onDelete={() => {
                          setNewVariant(prev => {
                            const newAttrs = { ...prev.attributes };
                            delete newAttrs[key];
                            return { ...prev, attributes: newAttrs };
                          });
                        }}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        </TabPanel>

        {/* Inventory Tab */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Stock Quantity"
                  type="number"
                  value={product.stock}
                  onChange={(e) => setProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  fullWidth
                  inputProps={{ min: 0 }}
                  helperText="Current stock level"
                />

                <TextField
                  label="Weight (grams)"
                  type="number"
                  value={product.weight || ''}
                  onChange={(e) => setProduct(prev => ({ 
                    ...prev, 
                    weight: parseFloat(e.target.value) || undefined 
                  }))}
                  fullWidth
                  inputProps={{ min: 0, step: 0.1 }}
                  helperText="Product weight for shipping calculations"
                />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Dimensions (cm)
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <TextField
                        label="Length"
                        type="number"
                        value={product.dimensions?.length || ''}
                        onChange={(e) => setProduct(prev => ({ 
                          ...prev, 
                          dimensions: {
                            ...prev.dimensions,
                            length: parseFloat(e.target.value) || undefined
                          }
                        }))}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: 0.1 }}
                      />
                    </Grid>
                    <Grid size={4}>
                      <TextField
                        label="Width"
                        type="number"
                        value={product.dimensions?.width || ''}
                        onChange={(e) => setProduct(prev => ({ 
                          ...prev, 
                          dimensions: {
                            ...prev.dimensions,
                            width: parseFloat(e.target.value) || undefined
                          }
                        }))}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: 0.1 }}
                      />
                    </Grid>
                    <Grid size={4}>
                      <TextField
                        label="Height"
                        type="number"
                        value={product.dimensions?.height || ''}
                        onChange={(e) => setProduct(prev => ({ 
                          ...prev, 
                          dimensions: {
                            ...prev.dimensions,
                            height: parseFloat(e.target.value) || undefined
                          }
                        }))}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, step: 0.1 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Shipping Class</InputLabel>
                  <Select
                    value={product.shippingClass || 'standard'}
                    label="Shipping Class"
                    onChange={(e) => setProduct(prev => ({ ...prev, shippingClass: e.target.value }))}
                  >
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="express">Express</MenuItem>
                    <MenuItem value="overnight">Overnight</MenuItem>
                    <MenuItem value="free">Free Shipping</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Tax Class</InputLabel>
                  <Select
                    value={product.taxClass || 'general'}
                    label="Tax Class"
                    onChange={(e) => setProduct(prev => ({ ...prev, taxClass: e.target.value }))}
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="reduced">Reduced Rate</MenuItem>
                    <MenuItem value="zero">Zero Rate</MenuItem>
                    <MenuItem value="exempt">Tax Exempt</MenuItem>
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Sale Period
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <TextField
                        label="Sale Start"
                        type="datetime-local"
                        value={
                          product.saleStart
                            ? typeof product.saleStart === 'string'
                              ? (product.saleStart as string).slice(0, 16)
                              : product.saleStart instanceof Date
                                ? product.saleStart.toISOString().slice(0, 16)
                                : ''
                            : ''
                        }
                        onChange={(e) => setProduct(prev => ({ 
                          ...prev, 
                          saleStart: e.target.value ? new Date(`${e.target.value}:00Z`) : undefined 
                        }))}
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        label="Sale End"
                        type="datetime-local"
                        value={
                          product.saleEnd
                            ? typeof product.saleEnd === 'string'
                              ? (product.saleEnd as string).slice(0, 16)
                              : (product.saleEnd instanceof Date
                                  ? product.saleEnd.toISOString().slice(0, 16)
                                  : '')
                            : ''
                        }
                        onChange={(e) => setProduct(prev => ({ 
                          ...prev, 
                          saleEnd: e.target.value ? new Date(`${e.target.value}:00Z`) : undefined 
                        }))}
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* SEO Tab */}
        <TabPanel value={activeTab} index={4}>
          <Box sx={{ maxWidth: 800 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Search Engine Optimization
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="SEO Title"
                value={product.name}
                onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                helperText={`${product.name.length}/60 characters. Keep under 60 for best results.`}
                inputProps={{ maxLength: 60 }}
              />

              <TextField
                label="Meta Description"
                value={product.description || ''}
                onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                fullWidth
                multiline
                rows={3}
                helperText={`${(product.description || '').length}/160 characters. Keep under 160 for best results.`}
                inputProps={{ maxLength: 160 }}
              />

              <TextField
                label="URL Slug"
                value={product.slug}
                onChange={(e) => setProduct(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                fullWidth
                helperText="Used in the product URL. Only lowercase letters, numbers, and hyphens."
              />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  SEO Preview
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline' }}>
                    {product.name || 'Product Title'}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    yourshop.com/products/{product.slug || 'product-slug'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {product.description || 'Product description will appear here...'}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </TabPanel>

        {/* Advanced Tab */}
        <TabPanel value={activeTab} index={5}>
          <Box sx={{ maxWidth: 800 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Advanced Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={12}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Product Statistics
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                          <Typography variant="h4" color="primary">
                            {product.salesCount}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Total Sales
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                          <Typography variant="h4" color="success.main">
                            {product.reviews.length}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Reviews
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                          <Typography variant="h4" color="warning.main">
                            {product.reviews.length > 0 
                              ? (product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(1)
                              : '0.0'
                            }
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Avg Rating
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                          <Typography variant="h4" color="info.main">
                            {product.stock}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            In Stock
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={12}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Timestamps
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Created At"
                          value={new Date(product.createdAt).toLocaleString()}
                          fullWidth
                          size="small"
                          InputProps={{ readOnly: true }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Last Updated"
                          value={new Date(product.updatedAt).toLocaleString()}
                          fullWidth
                          size="small"
                          InputProps={{ readOnly: true }}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Product Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  component="img"
                  src={product.mainPic || '/placeholder.png'}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: 300,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                    ${product.price}
                    {product.discount > 0 && (
                      <Typography component="span" variant="body2" sx={{ ml: 1, textDecoration: 'line-through' }}>
                        ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {product.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Stock: {product.stock} units available
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this product? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} /> : undefined}
          >
            {saving ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}