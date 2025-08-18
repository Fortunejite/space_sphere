'use client';

import { notFound, useParams } from 'next/navigation';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { fetchShop } from '@/redux/shopSlice';

import ShopNavbar from '@/components/shopNavbar';
import { Box, Typography } from '@mui/material';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { subdomain } = useParams();

  const dispatch = useAppDispatch();
  const { status, shop } = useAppSelector((s) => s.shop);

  useEffect(() => {
    if (subdomain) {
      dispatch(fetchShop(subdomain as string));
    }
  }, [dispatch, subdomain]);

  if (status === 'failed') return notFound();
  if (status === 'loading' || !shop) return null;

  if (shop.status === 'suspended' || shop.status === 'banned') {
    return (
      <Box sx={{ textAlign: 'center', padding: 4 }}>
        <Typography variant="h4" color="error">
          This shop is currently unavailable.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <ShopNavbar />
      {children}
    </>
  );
}
