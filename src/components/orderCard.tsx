'use client'

import { useState } from 'react';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Divider,
  Paper,
  Avatar,
  IconButton,
  LinearProgress,
  alpha,
  useTheme,
} from '@mui/material';

import {
  LocalShippingOutlined,
  CheckCircleOutlined,
  CancelOutlined,
  ReceiptOutlined,
  TrackChangesOutlined,
  MessageOutlined,
  StarOutlined,
  RefreshOutlined,
  DownloadOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';

import { IOrder } from '@/models/Order.model';
import { formatNumber } from '@/lib/utils';

const statusConfig = {
  processing: {
    color: 'warning' as const,
    icon: <TrackChangesOutlined />,
    label: 'Processing',
    description: 'Your order is being prepared'
  },
  shipped: {
    color: 'info' as const,
    icon: <LocalShippingOutlined />,
    label: 'Shipped',
    description: 'Your order is on the way'
  },
  delivered: {
    color: 'success' as const,
    icon: <CheckCircleOutlined />,
    label: 'Delivered',
    description: 'Order completed successfully'
  },
  cancelled: {
    color: 'error' as const,
    icon: <CancelOutlined />,
    label: 'Cancelled',
    description: 'Order was cancelled'
  }
};

const OrderStatusBadge = ({ status }: { status: keyof typeof statusConfig }) => {
  const config = statusConfig[status];
  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      variant="filled"
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
};

const OrderProgressTracker = ({ status, estimatedDelivery, actualDelivery }: { 
  status: string; 
  estimatedDelivery?: Date | null; 
  actualDelivery?: Date | null;
}) => {
  const steps = ['processing', 'shipped', 'delivered'];
  const currentStepIndex = steps.indexOf(status);
  const progress = status === 'cancelled' ? 0 : ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: alpha('#000', 0.1),
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            background: status === 'cancelled' 
              ? 'linear-gradient(90deg, #f44336 0%, #d32f2f 100%)'
              : 'linear-gradient(90deg, #4caf50 0%, #388e3c 100%)'
          }
        }}
      />
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        {steps.map((step, index) => (
          <Box key={step} sx={{ textAlign: 'center', flex: 1 }}>
            <Typography 
              variant="caption" 
              color={index <= currentStepIndex ? 'primary.main' : 'text.disabled'}
              fontWeight={index <= currentStepIndex ? 600 : 400}
            >
              {statusConfig[step as keyof typeof statusConfig].label}
            </Typography>
          </Box>
        ))}
      </Stack>
      {estimatedDelivery && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {actualDelivery 
            ? `Delivered on ${actualDelivery.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
            : `Estimated delivery: ${estimatedDelivery.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
          }
        </Typography>
      )}
    </Box>
  );
};

const OrderCard = ({ 
  order, 
  onCancelOrder, 
  onSupportRequest, 
  onReorder 
}: { 
  order: IOrder,
  onCancelOrder: (order: IOrder) => void,
  onSupportRequest: (order: IOrder) => void,
  onReorder: (order: IOrder) => void
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      sx={{ 
        mb: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Order Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={2} mb={1}>
              <Typography variant="h6" fontWeight={600}>
                Order #{order.trackingId}
              </Typography>
              <OrderStatusBadge status={order.status as keyof typeof statusConfig} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton size="small" color="primary">
              <ReceiptOutlined />
            </IconButton>
            <IconButton size="small" color="primary">
              <DownloadOutlined />
            </IconButton>
            <IconButton 
              size="small" 
              color="primary"
              onClick={() => setExpanded(!expanded)}
            >
              <VisibilityOutlined />
            </IconButton>
          </Stack>
        </Stack>

        {/* Order Items Preview */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            {order.cartItems.slice(0, 3).map(({product}) => (
              <Avatar
                key={product._id}
                src={product.mainPic}
                sx={{ 
                  width: 48, 
                  height: 48,
                  border: `2px solid ${theme.palette.background.paper}`,
                  boxShadow: theme.shadows[2]
                }}
              />
            ))}
            {order.cartItems.length > 3 && (
              <Avatar sx={{ width: 48, height: 48, bgcolor: 'grey.200', color: 'text.secondary' }}>
                +{order.cartItems.length - 3}
              </Avatar>
            )}
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {order.cartItems.length} item{order.cartItems.length > 1 ? 's' : ''}
              </Typography>
              <Typography variant="h6" color="primary.main" fontWeight={600}>
                ₦{formatNumber(order.totalAmount)}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Progress Tracker */}
        <OrderProgressTracker
          status={order.status}
          estimatedDelivery={order.estimatedDelivery}
          actualDelivery={order.actualDelivery}
        />

        {/* Tracking Info */}
        {order.trackingId && (
          <Paper sx={{ p: 2, mt: 2, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tracking ID
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {order.trackingId}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<LocalShippingOutlined />}
                sx={{ borderRadius: 2 }}
              >
                Track Package
              </Button>
            </Stack>
          </Paper>
        )}

        {/* Expanded Details */}
        {expanded && (
          <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Order Details
            </Typography>
            <Stack spacing={2}>
              {order.cartItems.map(({product, quantity}) => (
                <Stack key={product._id} direction="row" spacing={2} alignItems="center">
                  <Avatar src={product.mainPic} sx={{ width: 56, height: 56 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight={500}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {quantity}
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600}>
                    ₦{formatNumber(product.price.toFixed(0))}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Shipping Address
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {order.shipmentInfo?.address}
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<MessageOutlined />}
                sx={{ borderRadius: 2 }}
                onClick={() => onSupportRequest(order)}
              >
                Contact Support
              </Button>
              {order.status === 'delivered' && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<StarOutlined />}
                  sx={{ borderRadius: 2 }}
                >
                  Leave Review
                </Button>
              )}
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshOutlined />}
                sx={{ borderRadius: 2 }}
                onClick={() => onReorder(order)}
              >
                Reorder
              </Button>
            </Stack>
          </Box>
        )}

        {/* Quick Actions */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {order.status === 'processing' && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              sx={{ borderRadius: 2 }}
              onClick={() => onCancelOrder(order)}
            >
              Cancel Order
            </Button>
          )}
          {order.status === 'delivered' && (
            <Button
              variant="contained"
              size="small"
              startIcon={<StarOutlined />}
              sx={{ borderRadius: 2 }}
            >
              Rate & Review
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OrderCard;