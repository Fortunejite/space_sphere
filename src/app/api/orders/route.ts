import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { requireAuth } from '@/lib/apiAuth';

import { errorHandler } from '@/lib/errorHandler';
import { orderSchema } from '@/lib/schema/order';
import { calculateCartTotal, formatNumber } from '@/lib/utils';

import Cart from '@/models/Cart.model';
import Order from '@/models/Order.model';
import '@/models/Product.model';
import dbConnect from '@/lib/mongodb';
import { CartWithShopAndItems } from '@/types/cart';

const generateTrackingId = () =>
  Math.floor(100000000 * Math.random() * 9000000000);

export const GET = errorHandler(async (request) => {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');
  const fetchOrderStatus = searchParams.get('status') === 'true';

  // Pagination
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const skip = (page - 1) * limit;

  if (!shopId) {
    throw Object.assign(new Error('Shop ID param is required'), {
      status: 400,
    });
  }
  const user = await requireAuth();

  const orders = await Order.find({ shop: shopId, user: user._id })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate('cartItems.product');

  const totalOrders = await Order.countDocuments({
    shop: shopId,
    user: user._id,
  });

  if (!fetchOrderStatus) {
    return NextResponse.json({
      success: true,
      data: orders,
      total: totalOrders,
    });
  }

  const statsPromise = Order.aggregate([
    { $match: { shop: new ObjectId(shopId), user: new ObjectId(user._id) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const stats = (await statsPromise).reduce(
    (acc: { [x: string]: string }, stat: { _id: string; count: string }) => {
      acc[stat._id] = stat.count;
      return acc;
    },
    {},
  );
  stats.total = totalOrders;

  return NextResponse.json({
    success: true,
    data: orders,
    total: totalOrders,
    stats,
  });
});

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

  const userCart: CartWithShopAndItems | null = await Cart.findOne({
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
    product: item.productId._id,
    quantity: item.quantity,
    variantIndex: item.variantIndex,
    price: item.productId.price.toFixed(0),
  }));

  const totalAmount = formatNumber(
    calculateCartTotal(shopCart.items).toFixed(0),
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
