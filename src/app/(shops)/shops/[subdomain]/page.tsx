'use client';

import { useAppSelector } from '@/hooks/redux.hook';

const ShopPage = () => {
  const { shop } = useAppSelector((state) => state.shop);
  return <div>{shop.name}</div>;
};

export default ShopPage;
