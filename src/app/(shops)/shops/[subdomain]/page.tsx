'use client';

import { useAppSelector } from '@/hooks/redux.hook';

const ShopPage = () => {
  const { shop } = useAppSelector((state) => state.shop);

  if(!shop) return null

  return <div>{shop.name}</div>;
};

export default ShopPage;
