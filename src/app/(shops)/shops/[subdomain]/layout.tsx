'use client';

import ShopNavbar from '@/components/shopNavbar';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { fetchShop } from '@/redux/shopSlice';
import { notFound, useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { subdomain } = useParams();

  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector((s) => s.shop);

  useEffect(() => {
    if (subdomain) {
      dispatch(fetchShop(subdomain as string));
    }
  }, [dispatch, subdomain]); // now only re-runs if `subdomain` actually changes

  if (error || status === 'loading') {
    if (error === 'NOT_FOUND') return notFound();
    return null;
  }

  return (
    <>
      <ShopNavbar />
      {children}
    </>
  );
}
