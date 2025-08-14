'use client';

import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  alpha,
  useTheme,
  Button
} from '@mui/material';
import {
  TrendingUpOutlined,
  TrendingDownOutlined,
  ShoppingBagOutlined,
  PeopleOutlined,
  InventoryOutlined,
  AttachMoneyOutlined,
  VisibilityOutlined,
  LocalShippingOutlined,
  CancelOutlined,
  CheckCircleOutlined,
  PendingOutlined,
  ArrowForwardOutlined
} from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data
const salesData = [
  { name: 'Jan', sales: 4000, orders: 240 },
  { name: 'Feb', sales: 3000, orders: 139 },
  { name: 'Mar', sales: 2000, orders: 980 },
  { name: 'Apr', sales: 2780, orders: 390 },
  { name: 'May', sales: 1890, orders: 480 },
  { name: 'Jun', sales: 2390, orders: 380 },
  { name: 'Jul', sales: 3490, orders: 430 }
];

const categoryData = [
  { name: 'Electronics', value: 400, color: '#8884d8' },
  { name: 'Fashion', value: 300, color: '#82ca9d' },
  { name: 'Home & Garden', value: 200, color: '#ffc658' },
  { name: 'Sports', value: 100, color: '#ff7c7c' }
];

const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    amount: 125000,
    status: 'completed',
    time: '2 mins ago'
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    amount: 85000,
    status: 'processing',
    time: '15 mins ago'
  },
  {
    id: 'ORD-003',
    customer: 'Mike Johnson',
    amount: 67000,
    status: 'pending',
    time: '1 hour ago'
  },
  {
    id: 'ORD-004',
    customer: 'Sarah Wilson',
    amount: 92000,
    status: 'shipped',
    time: '2 hours ago'
  }
];

const topProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    sales: 245,
    revenue: 6125000,
    growth: 12.5
  },
  {
    id: 2,
    name: 'Smart Watch',
    sales: 189,
    revenue: 4725000,
    growth: -5.2
  },
  {
    id: 3,
    name: 'Laptop Stand',
    sales: 156,
    revenue: 1560000,
    growth: 8.9
  },
  {
    id: 4,
    name: 'USB-C Cable',
    sales: 298,
    revenue: 894000,
    growth: 15.7
  }
];

const AdminDashboard = () => {
  const theme = useTheme();

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

  const StatCard = ({ title, value, change, icon, color, subtitle }: StatCardProps) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 40px ${alpha(color, 0.15)}`
        },
        transition: 'all 0.3s ease'
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700} color="text.primary" mt={1}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          )}
          <Stack direction="row" alignItems="center" spacing={1} mt={2}>
            {change > 0 ? (
              <TrendingUpOutlined sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <TrendingDownOutlined sx={{ fontSize: 16, color: 'error.main' }} />
            )}
            <Typography
              variant="caption"
              color={change > 0 ? 'success.main' : 'error.main'}
              fontWeight={600}
            >
              {Math.abs(change)}% vs last month
            </Typography>
          </Stack>
        </Box>
        <Avatar
          sx={{
            bgcolor: color,
            width: 56,
            height: 56,
            boxShadow: `0 8px 20px ${alpha(color, 0.3)}`
          }}
        >
          {icon}
        </Avatar>
      </Stack>
    </Paper>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'pending': return 'warning';
      case 'shipped': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleOutlined fontSize="small" />;
      case 'processing': return <PendingOutlined fontSize="small" />;
      case 'pending': return <PendingOutlined fontSize="small" />;
      case 'shipped': return <LocalShippingOutlined fontSize="small" />;
      case 'cancelled': return <CancelOutlined fontSize="small" />;
      default: return <PendingOutlined fontSize="small" />;
    }
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here&apos;s what&apos;s happening with your shop today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <StatCard
            title="Total Revenue"
            value="₦2.4M"
            subtitle="This month"
            change={12.5}
            icon={<AttachMoneyOutlined />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <StatCard
            title="Total Orders"
            value="1,247"
            subtitle="This month"
            change={8.2}
            icon={<ShoppingBagOutlined />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <StatCard
            title="Total Customers"
            value="894"
            subtitle="Active users"
            change={15.7}
            icon={<PeopleOutlined />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <StatCard
            title="Total Products"
            value="156"
            subtitle="In inventory"
            change={-2.4}
            icon={<InventoryOutlined />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Sales Chart */}
        <Grid size={{xs: 12, md: 8}}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              height: 400
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Sales Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Revenue and orders over time
                </Typography>
              </Box>
              <Button
                startIcon={<VisibilityOutlined />}
                variant="outlined"
                size="small"
              >
                View Report
              </Button>
            </Stack>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 8
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke={theme.palette.primary.main}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Category Distribution */}
        <Grid size={{xs: 12, md: 4}}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              height: 400
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={1}>
              Sales by Category
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Product category distribution
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Stack spacing={1} mt={2}>
              {categoryData.map((item, index) => (
                <Stack key={index} direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: item.color
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {item.name}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={600}>
                    {item.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid size={{xs: 12, sm: 6}}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Recent Orders
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Latest customer orders
                </Typography>
              </Box>
              <Button
                endIcon={<ArrowForwardOutlined />}
                variant="text"
                size="small"
              >
                View All
              </Button>
            </Stack>
            <List sx={{ p: 0 }}>
              {recentOrders.map((order, index) => (
                <Box key={order.id}>
                  <ListItem sx={{ p: 0, py: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                        {getStatusIcon(order.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {order.id}
                          </Typography>
                          <Chip
                            label={order.status}
                            size="small"
                            color={getStatusColor(order.status) as 'success' | 'info' | 'warning' | 'primary' | 'error' | 'default'}
                            variant="outlined"
                          />
                        </Stack>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {order.customer}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.time}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="subtitle2" fontWeight={600} color="primary">
                        ₦{order.amount.toLocaleString()}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < recentOrders.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Top Products */}
        <Grid size={{xs: 12, sm: 6}}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Top Products
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Best performing products
                </Typography>
              </Box>
              <Button
                endIcon={<ArrowForwardOutlined />}
                variant="text"
                size="small"
              >
                View All
              </Button>
            </Stack>
            <Stack spacing={2}>
              {topProducts.map((product) => (
                <Box
                  key={product.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {product.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {product.growth > 0 ? (
                        <TrendingUpOutlined sx={{ fontSize: 16, color: 'success.main' }} />
                      ) : (
                        <TrendingDownOutlined sx={{ fontSize: 16, color: 'error.main' }} />
                      )}
                      <Typography
                        variant="caption"
                        color={product.growth > 0 ? 'success.main' : 'error.main'}
                        fontWeight={600}
                      >
                        {Math.abs(product.growth)}%
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      {product.sales} sales
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={600} color="primary">
                      ₦{product.revenue.toLocaleString()}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
