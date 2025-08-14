import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { generateTrackingId, requireAuth } from '@/lib/utils';

import { errorHandler } from '@/lib/errorHandler';
import { orderSchema } from '@/lib/schema/order';
import { calculateCartTotal, formatNumber } from '@/lib/utils';

import Cart from '@/models/Cart.model';
import Order from '@/models/Order.model';
import '@/models/Product.model';
import dbConnect from '@/lib/mongodb';
import { getShopBySubdomain } from '@/lib/shop';
import { CartWithItems } from '@/types/cart';

await dbConnect();

export const GET = errorHandler(async (request, { params }) => {
  await dbConnect();
  const { subdomain } = await params;
  const { searchParams } = new URL(request.url);
  const fetchOrderStatus = searchParams.get('status') === 'true';

  // Pagination
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const skip = (page - 1) * limit;

  if (!subdomain) {
    throw Object.assign(new Error('Shop Subdomain param is required'), {
      status: 400,
    });
  }
  const shop = await getShopBySubdomain(subdomain);
  const user = await requireAuth();

  const orders = await Order.find({ shop: shop._id, user: user._id })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate('cartItems.product');

  const totalOrders = await Order.countDocuments({
    shop: shop._id,
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
    { $match: { shop: new ObjectId(shop._id), user: new ObjectId(user._id) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const stats = (await statsPromise).reduce(
    (acc: { [key: string]: number }, stat: { _id: string; count: number }) => {
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

export const POST = errorHandler(async (request, { params }) => {
  const user = await requireAuth();
  const { subdomain } = await params;
  if (!subdomain) {
    throw Object.assign(new Error('Shop Subdomain param is required'), {
      status: 400,
    });
  }

  const { paymentMethod, paymentReference, ...body } =
    await request.json();
  
  const shop = await getShopBySubdomain(subdomain);
  const { note, ...shipmentInfo } = orderSchema.parse(body);

  const userCart = await Cart.findOne({
    user: user._id,
  }).populate('shops.items.productId') as CartWithItems;

  const shopCart = userCart?.shops.find(
    (targetShop) => targetShop.shopId === shop._id.toString(),
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
    price: formatNumber(item.productId.price.toFixed(0)),
  }));

  const totalAmount = formatNumber(
    calculateCartTotal(shopCart.items).toFixed(0),
  );

  const payload = {
    shop: shop._id,
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
    { user: user._id, 'shops.shopId': shop._id },
    { $pull: { shops: { shopId: shop._id } } },
  );
  await order.populate('cartItems.product');
  return NextResponse.json({ success: true, ...payload });
});
