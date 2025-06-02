'use client';

import { useAppSelector } from '@/hooks/redux.hook';
import { getShopCart } from '@/redux/cartSlice';

const CartPage = () => {
  const { shop } = useAppSelector((state) => state.shop);
  const items = useAppSelector((state) => getShopCart(state, shop._id));
  return (
    <div>
      <h1>Cart Page</h1>
      <p>{JSON.stringify(items)}</p>
    </div>
  );
};

export default CartPage;
