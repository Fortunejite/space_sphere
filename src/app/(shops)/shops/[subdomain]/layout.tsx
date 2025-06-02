'use client';

import { notFound, useParams } from 'next/navigation';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { fetchShop } from '@/redux/shopSlice';

import ShopNavbar from '@/components/shopNavbar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { subdomain } = useParams();

  const dispatch = useAppDispatch();
  const { status } = useAppSelector((s) => s.shop);

  useEffect(() => {
    if (subdomain) {
      dispatch(fetchShop(subdomain as string));
    }
  }, [dispatch, subdomain]);

  if (status === 'loading') return <div>Loading ...</div>;

  if (status === 'failed') return notFound();

  return (
    <>
      <ShopNavbar />
      {children}
    </>
  );
}
