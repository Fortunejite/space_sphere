'use client';

import {
  Box,
  Paper,
  Typography,
  Stack,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  alpha,
  useTheme,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUpOutlined,
  TrendingDownOutlined,
  ShoppingBagOutlined,
  PeopleOutlined,
  AttachMoneyOutlined,
  VisibilityOutlined,
  ShoppingCartOutlined,
  DevicesOutlined,
  DownloadOutlined,
  RefreshOutlined
} from '@mui/icons-material';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { useState } from 'react';

// Mock data
const salesData = [
  { name: 'Jan', revenue: 4500000, orders: 245, visitors: 3200 },
  { name: 'Feb', revenue: 3200000, orders: 189, visitors: 2800 },
  { name: 'Mar', revenue: 5100000, orders: 298, visitors: 4100 },
  { name: 'Apr', revenue: 4800000, orders: 267, visitors: 3900 },
  { name: 'May', revenue: 6200000, orders: 356, visitors: 4800 },
  { name: 'Jun', revenue: 5800000, orders: 334, visitors: 4500 },
  { name: 'Jul', revenue: 7100000, orders: 412, visitors: 5200 }
];

const categoryData = [
  { name: 'Electronics', value: 45, revenue: 12500000, color: '#8884d8' },
  { name: 'Fashion', value: 30, revenue: 8200000, color: '#82ca9d' },
  { name: 'Home & Garden', value: 15, revenue: 4100000, color: '#ffc658' },
  { name: 'Sports', value: 10, revenue: 2700000, color: '#ff7c7c' }
];

const deviceData = [
  { device: 'Mobile', percentage: 65, sessions: 8450 },
  { device: 'Desktop', percentage: 28, sessions: 3640 },
  { device: 'Tablet', percentage: 7, sessions: 910 }
];

const topProducts = [
  { name: 'Wireless Headphones', revenue: 2450000, growth: 12.5, sales: 245 },
  { name: 'Smart Watch', revenue: 1890000, growth: -3.2, sales: 189 },
  { name: 'Laptop Stand', revenue: 1560000, growth: 8.7, sales: 156 },
  { name: 'USB-C Cable', revenue: 890000, growth: 15.3, sales: 298 },
  { name: 'Phone Case', revenue: 670000, growth: 5.8, sales: 134 }
];

const trafficSources = [
  { source: 'Organic Search', percentage: 45, sessions: 5850, color: '#4caf50' },
  { source: 'Direct', percentage: 25, sessions: 3250, color: '#2196f3' },
  { source: 'Social Media', percentage: 18, sessions: 2340, color: '#ff9800' },
  { source: 'Referral', percentage: 8, sessions: 1040, color: '#9c27b0' },
  { source: 'Email', percentage: 4, sessions: 520, color: '#f44336' }
];

const topCountries = [
  { country: 'Nigeria', flag: '🇳🇬', sessions: 8450, percentage: 65 },
  { country: 'Ghana', flag: '🇬🇭', sessions: 1950, percentage: 15 },
  { country: 'Kenya', flag: '🇰🇪', sessions: 1300, percentage: 10 },
  { country: 'South Africa', flag: '🇿🇦', sessions: 910, percentage: 7 },
  { country: 'United States', flag: '🇺🇸', sessions: 390, percentage: 3 }
];

const Analytics = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('7d');

  const StatCard = ({ title, value, change, icon, color, subtitle }: {
    title: string;
    value: string;
    change: number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }) => (
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
              {Math.abs(change)}% vs last period
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

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your shop&apos;s performance and customer insights
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 3 months</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<DownloadOutlined />}
            sx={{ borderRadius: 2 }}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshOutlined />}
            sx={{ borderRadius: 2 }}
          >
            Refresh
          </Button>
        </Stack>
      </Stack>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <StatCard
            title="Total Revenue"
            value="₦7.1M"
            subtitle="This month"
            change={15.2}
            icon={<AttachMoneyOutlined />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <StatCard
            title="Total Orders"
            value="412"
            subtitle="This month"
            change={8.7}
            icon={<ShoppingBagOutlined />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <StatCard
            title="Visitors"
            value="5,200"
            subtitle="This month"
            change={12.3}
            icon={<PeopleOutlined />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <StatCard
            title="Conversion Rate"
            value="7.9%"
            subtitle="Orders/Visitors"
            change={-2.1}
            icon={<ShoppingCartOutlined />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue Chart */}
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
                  Revenue Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly revenue and order trends
                </Typography>
              </Box>
              <Button
                startIcon={<VisibilityOutlined />}
                variant="outlined"
                size="small"
              >
                View Details
              </Button>
            </Stack>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={theme.palette.primary.main}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
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
              Revenue breakdown by product category
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <Stack spacing={1.5} mt={2}>
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
                    <Typography variant="body2">
                      {item.name}
                    </Typography>
                  </Stack>
                  <Stack alignItems="flex-end">
                    <Typography variant="body2" fontWeight={600}>
                      {item.value}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ₦{(item.revenue / 1000000).toFixed(1)}M
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Top Products */}
        <Grid size={{xs: 12, md: 6}}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={3}>
              Top Performing Products
            </Typography>
            <List sx={{ p: 0 }}>
              {topProducts.map((product, index) => (
                <Box key={index}>
                  <ListItem sx={{ p: 0, py: 2 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          fontWeight: 600
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          {product.name}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            {product.sales} sales
                          </Typography>
                          <Chip
                            label={`${product.growth > 0 ? '+' : ''}${product.growth}%`}
                            size="small"
                            color={product.growth > 0 ? 'success' : 'error'}
                            variant="outlined"
                            sx={{ height: 18, fontSize: '0.7rem' }}
                          />
                        </Stack>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="subtitle2" fontWeight={600} color="primary">
                        ₦{(product.revenue / 1000).toLocaleString()}K
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < topProducts.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Traffic Sources */}
        <Grid size={{xs: 12, md: 6}}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={3}>
              Traffic Sources
            </Typography>
            <Stack spacing={2}>
              {trafficSources.map((source, index) => (
                <Box key={index}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: source.color
                        }}
                      />
                      <Typography variant="body2" fontWeight={500}>
                        {source.source}
                      </Typography>
                    </Stack>
                    <Stack alignItems="flex-end">
                      <Typography variant="body2" fontWeight={600}>
                        {source.percentage}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {source.sessions.toLocaleString()} sessions
                      </Typography>
                    </Stack>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={source.percentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha(source.color, 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: source.color,
                        borderRadius: 3
                      }
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Device Analytics */}
        <Grid size={{xs: 12, md: 4}}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={3}>
              Device Breakdown
            </Typography>
            <Stack spacing={3}>
              {deviceData.map((device, index) => (
                <Box key={index}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <DevicesOutlined color="primary" />
                      <Typography variant="body2" fontWeight={500}>
                        {device.device}
                      </Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      {device.percentage}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={device.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {device.sessions.toLocaleString()} sessions
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Geographic Data */}
        <Grid size={{xs: 12, md: 8}}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={3}>
              Top Countries
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Country</TableCell>
                    <TableCell align="right">Sessions</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                    <TableCell align="right">Trend</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topCountries.map((country, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="h6">
                            {country.flag}
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {country.country}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {country.sessions.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {country.percentage}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <LinearProgress
                          variant="determinate"
                          value={country.percentage}
                          sx={{
                            width: 60,
                            height: 4,
                            borderRadius: 2
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
