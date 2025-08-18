'use client';

import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Badge,
  Paper,
  Stack,
  Chip
} from '@mui/material';
import {
  MenuOutlined,
  DashboardOutlined,
  ShoppingBagOutlined,
  InventoryOutlined,
  PeopleOutlined,
  AnalyticsOutlined,
  SettingsOutlined,
  NotificationsOutlined,
  LogoutOutlined,
  StoreOutlined,
  TrendingUpOutlined,
  AccountCircleOutlined
} from '@mui/icons-material';
import { useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux.hook';
import { useSession } from 'next-auth/react';

const DRAWER_WIDTH = 280;

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardOutlined />,
    path: '/admin',
    color: '#667eea'
  },
  {
    text: 'Orders',
    icon: <ShoppingBagOutlined />,
    path: '/admin/orders',
    color: '#f093fb',
    badge: 12
  },
  {
    text: 'Products',
    icon: <InventoryOutlined />,
    path: '/admin/products',
    color: '#4facfe'
  },
  {
    text: 'Customers',
    icon: <PeopleOutlined />,
    path: '/admin/customers',
    color: '#43e97b'
  },
  {
    text: 'Analytics',
    icon: <AnalyticsOutlined />,
    path: '/admin/analytics',
    color: '#fa709a'
  },
  {
    text: 'Settings',
    icon: <SettingsOutlined />,
    path: '/admin/settings',
    color: '#a8c8ec'
  }
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const pathname = usePathname();
  const { shop } = useAppSelector((state) => state.shop);
  const { data: session } = useSession();
  const user = session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!shop || !user) {
    return null; // Prevent rendering if shop or user data is not available
  }

  if (shop.ownerId !== user._id) {
    // If the user's shop ID doesn't match the shop in the URL, redirect or show an error
    router.replace(`/shops/${shop?.subdomain}`);
    return null; // Prevent rendering the layout if user is not authorized
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin' || pathname.endsWith('/admin');
    }
    return pathname.includes(path);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <StoreOutlined sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {shop?.name || 'Shop Admin'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Admin Dashboard
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Menu Items */}
      <Box sx={{ flex: 1, p: 2 }}>
        <List sx={{ '& .MuiListItem-root': { mb: 1 } }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  router.push(`/shops/${shop?.subdomain}${item.path}`);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  backgroundColor: isActive(item.path) 
                    ? alpha(item.color, 0.15) 
                    : 'transparent',
                  border: isActive(item.path) 
                    ? `2px solid ${alpha(item.color, 0.3)}` 
                    : '2px solid transparent',
                  '&:hover': {
                    backgroundColor: alpha(item.color, 0.1),
                    transform: 'translateX(4px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? item.color : 'text.secondary',
                    minWidth: 40
                  }}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 600 : 500,
                    color: isActive(item.path) ? item.color : 'text.primary'
                  }}
                />
                {isActive(item.path) && (
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      borderRadius: 2,
                      backgroundColor: item.color
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Quick Stats */}
      <Paper
        elevation={0}
        sx={{
          m: 2,
          p: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <TrendingUpOutlined color="success" />
          <Typography variant="subtitle2" fontWeight={600}>
            Today&apos;s Sales
          </Typography>
        </Stack>
        <Typography variant="h5" fontWeight={700} color="success.main">
          ₦2,450,000
        </Typography>
        <Chip
          label="+12.5% from yesterday"
          size="small"
          color="success"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(20px)',
          background: alpha(theme.palette.background.paper, 0.8)
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              // color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuOutlined />
            </IconButton>
            <Box>
              <Typography variant="h6" color="text.primary" fontWeight={600}>
                Good morning! 👋
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Let&apos;s manage your shop today
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton size="large">
              <Badge badgeContent={4} color="error">
                <NotificationsOutlined />
              </Badge>
            </IconButton>
            
            <IconButton
              size="large"
              onClick={handleProfileMenuOpen}
              sx={{
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                '&:hover': {
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 36,
                  height: 36
                }}
              >
                <AccountCircleOutlined />
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
                }
              }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <ListItemIcon>
                  <AccountCircleOutlined fontSize="small" />
                </ListItemIcon>
                Profile Settings
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <ListItemIcon>
                  <SettingsOutlined fontSize="small" />
                </ListItemIcon>
                Account Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleProfileMenuClose}>
                <ListItemIcon>
                  <LogoutOutlined fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              border: 'none',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
            }
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              border: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          backgroundColor: '#f8fafc'
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
