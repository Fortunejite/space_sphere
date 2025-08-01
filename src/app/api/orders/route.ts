import { NextResponse } from 'next/server';

import { auth } from '@/auth';

import { errorHandler } from '@/lib/errorHandler';
import { orderSchema } from '@/lib/schema/order';
import { calculateCartTotal, formatNumber } from '@/lib/utils';

import Cart, { ICart } from '@/models/Cart.model';
import Order from '@/models/Order.model';
import '@/models/Product.model';

const generateTrackingId = () =>
  Math.floor(100000000 * Math.random() * 9000000000);

async function requireAuth() {
  const session = await auth();
  if (!session) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 });
  }
  return session.user;
}

export const POST = errorHandler(async (request) => {
  const user = await requireAuth();

  const { shopId, paymentMethod, paymentReference, ...body } =
    await request.json();
  if (!shopId) {
    throw Object.assign(new Error('Shop ID param is required'), {
      status: 400,
    });
  }
  const { note, ...shipmentInfo } = orderSchema.parse(body);

  const userCart: ICart | null = await Cart.findOne({
    user: user._id,
  }).populate('shops.items.productId');
  const shopCart = userCart?.shops.find(
    (shop) => shop.shopId.toString() === shopId,
  );

  if (!shopCart) {
    throw Object.assign(new Error('Shop with id not in cart'), {
      status: 400,
    });
  }

  const cartItems = shopCart.items.map((item) => ({
    product: (item.productId as { _id: string })._id,
    quantity: item.quantity,
    variantIndex: item.variantIndex,
    price: formatNumber((item.productId as { price: number }).price.toFixed(0)),
  }));

  const totalAmount = formatNumber(
    calculateCartTotal(shopCart.items as any[]).toFixed(0),
  );

  const payload = {
    shop: shopId,
    user: user._id,
    trackingId: generateTrackingId(),
    cartItems,
    totalAmount,
    paymentMethod,
    paymentReference,
    shipmentInfo,
    note,
  };

  const order = new Order(payload);
  await order.save();
  
  // Remove the shop from the user's cart after order creation
  await Cart.updateOne(
    { user: user._id, 'shops.shopId': shopId },
    { $pull: { shops: { shopId } } },
  );
  await order.populate('cartItems.product');
  return NextResponse.json({ success: true, ...payload });
});
