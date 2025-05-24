'use client';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slide,
  Stack,
  styled,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@mui/material';

import {
  ShoppingCartOutlined,
  Menu as MenuIcon,
  KeyboardArrowRight,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useAppSelector } from '@/hooks/redux.hook';
import { useRouter } from 'next/navigation';

interface DrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Links = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'About',
    url: '/',
  },
  {
    name: 'Features',
    url: '/',
  },
  {
    name: 'Contact',
    url: '/',
  },
];

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  padding: 2,
  display: 'flex',
  overflow: 'hidden',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  // [theme.breakpoints.down('sm')]: {
  //   pr: 1,
  // },
}));

const DrawerComponent = ({ open, setOpen }: DrawerProps) => {
  const router = useRouter();
  const { categories } = useAppSelector((state) => state.category);

  // The items variable uses nested children.
  const items = [
    { name: 'Shops', url: '/shops' },
    {
      name: 'Categories',
      children: categories.map((category) => ({
        name: category.name,
        url: `/collections/brands/${category.name}`,
      })),
    },
    {
      name: 'Products',
      url: '/products',
    },
  ];

  // State for handling the nested (child) view.
  const [nestedItems, setNestedItems] = useState<
    { name: string; url: string }[] | null
  >(null);

  const [nestedTitle, setNestedTitle] = useState('');

  const handleParentClick = (
    item:
      | {
          name: string;
          url: string;
          children?: undefined;
        }
      | {
          name: string;
          children: {
            name: string;
            url: string;
          }[];
          url?: undefined;
        },
  ) => {
    if (item.children) {
      setNestedItems(item.children);
      setNestedTitle(item.name);
    } else {
      setOpen(false);
      router.push(item.url);
    }
  };

  return (
    <SwipeableDrawer
      anchor='left'
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <Box
        width={250}
        position='relative'
        height='100%'
        bgcolor='background.default'
      >
        <List>
          {items.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton onClick={() => handleParentClick(item)}>
                <ListItemText primary={item.name} />
                {item.children && <KeyboardArrowRight />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Nested view overlay with slide animation */}
        <Slide
          direction='left'
          in={Boolean(nestedItems)}
          mountOnEnter
          unmountOnExit
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 250,
              height: '100%',
              backgroundColor: 'background.default',
              zIndex: 10,
              boxShadow: 3,
            }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setNestedItems(null)}>
                  <ListItemIcon>
                    <ArrowBackIcon />
                  </ListItemIcon>
                  <ListItemText primary={nestedTitle} />
                </ListItemButton>
              </ListItem>
              {nestedItems?.map((child) => (
                <ListItem
                  key={child.name}
                  disablePadding
                  onClick={() => setOpen(false)}
                >
                  <ListItemButton component={Link} href={child.url}>
                    <ListItemText primary={child.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Slide>
      </Box>
    </SwipeableDrawer>
  );
};

const Navbar = () => {
  const { status } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppBar position='sticky' elevation={1}>
      <StyledToolbar>
        <Box display={{ xs: 'block', sm: 'none' }}>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ alignItems: 'center' }}
            aria-label='Open navigation menu'
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <DrawerComponent open={drawerOpen} setOpen={setDrawerOpen} />
        <Typography
          variant='h2'
          component={Link}
          href='/'
          mx={{ xs: 'auto', sm: 0 }}
        >
          Shop Sphere
        </Typography>
        <Stack direction={'row'} gap={2} display={{ xs: 'none', sm: 'flex' }}>
          {Links.map((link) => (
            <Box key={link.url}>
              <Link href={link.url}>{link.name}</Link>
            </Box>
          ))}
        </Stack>
        {status === 'authenticated' ? (
          <Stack direction={'row'} alignItems={'center'}>
            <IconButton color='inherit'>
              <SearchIcon />
            </IconButton>
            <Box display={{ xs: 'none', sm: 'block' }}>
              <Avatar
                sx={{ width: 30, height: 30, cursor: 'pointer' }}
                alt='User avatar'
              />
            </Box>
            <IconButton color='inherit'>
              <Badge badgeContent={4} color='secondary'>
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Stack>
        ) : (
          <Stack direction={'row'} gap={2}>
            <Button
              size='small'
              variant='contained'
              LinkComponent={Link}
              href='/login'
            >
              Login
            </Button>
            <Box display={{ xs: 'none', sm: 'block' }}>
              <Button
                size='small'
                variant='outlined'
                LinkComponent={Link}
                href='/register'
              >
                Sign up
              </Button>
            </Box>
          </Stack>
        )}
      </StyledToolbar>
    </AppBar>
  );
};

export default Navbar;
