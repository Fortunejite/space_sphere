import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/apiAuth';
import Order from '@/models/Order.model';
import '@/models/Shop.model';
import '@/models/Product.model';
import '@/models/User.model';
import dbConnect from '@/lib/mongodb';
import { errorHandler } from '@/lib/errorHandler';
import { updateShopStats } from '@/models/ShopStats.model';
import { getShopBySubdomain } from '@/lib/shop';

await dbConnect();

export const GET = errorHandler(async (req, { params }) => {
  const user = await requireAuth();

  const { trackingId } = await params;
  if (!trackingId) {
    return NextResponse.json(
      { message: 'Tracking ID is required' },
      { status: 400 },
    );
  }

  const order = await Order.findOne({ trackingId, user: user._id})
    .populate('shopId')
    .populate('cartItems.product')
    .populate('user');
  if (!order) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json(order);
});

export const DELETE = errorHandler(async (_, { params }) => {
  const user = await requireAuth();

  const { trackingId, subdomain } = await params;
  if (!trackingId || !subdomain) {
    return NextResponse.json(
      { message: 'Tracking ID and Subdomain are required' },
      { status: 400 },
    );
  }

  const shop = await getShopBySubdomain(subdomain);

  const order = await Order.findOne({ trackingId, user: user._id });
  if (!order)
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });

  if (order.user !== user._id) {
    return NextResponse.json(
      { message: 'Insufficient Permission' },
      { status: 403 },
    );
  }
  if (order.status !== 'processing') {
    return NextResponse.json(
      { message: 'Only processing orders can be cancelled' },
      { status: 400 },
    );
  }
  
  order.status = 'cancelled';
  await order.save();

  const todayKey = new Date().toISOString().slice(0, 10);
  // Update the shop's order count
  const stats = {
    pendingOrders: -1,
    cancelledOrders: 1,
    revenueCents: order.totalAmount * -100,
    [`daily.${todayKey}.orders`]: -1,
    [`daily.${todayKey}.revenueCents`]: order.totalAmount * -100,
  };
  await updateShopStats(shop._id, stats);
  return NextResponse.json({ message: 'Cancelled successfully' });
});
