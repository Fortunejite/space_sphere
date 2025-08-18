import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/apiAuth';
import Order from '@/models/Order.model';

import dbConnect from '@/lib/mongodb';
import { errorHandler } from '@/lib/errorHandler';
import { getShopBySubdomain } from '@/lib/shop';
import { getOrderStatusAttribute, updateShopStats } from '@/models/ShopStats.model';

await dbConnect();

export const GET = errorHandler(async (req, { params }) => {
  const user = await requireAuth();
  const { subdomain, trackingId } = await params;
  if (!subdomain || !trackingId) {
    return NextResponse.json(
      { message: 'Shop Subdomain and Tracking ID are required' },
      { status: 400 },
    );
  }

  const shop = await getShopBySubdomain(subdomain);
  if (user._id !== shop.ownerId._id.toString()) {
    return NextResponse.json(
      { message: 'Insufficient Permission' },
      { status: 403 },
    );
  }

  const order = await Order.findOne({ trackingId, shop: shop._id })
    .populate('shopId')
    .populate('cartItems.product')
    .populate('user');
  if (!order) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json(order);
});

export const PATCH = errorHandler(async (req, { params }) => {
  const user = await requireAuth();
  const { subdomain, trackingId } = await params;
  if (!subdomain || !trackingId) {
    return NextResponse.json(
      { message: 'Shop Subdomain and Tracking ID are required' },
      { status: 400 },
    );
  }
  const shop = await getShopBySubdomain(subdomain);
  if (user._id !== shop.ownerId._id.toString()) {
    return NextResponse.json(
      { message: 'Insufficient Permission' },
      { status: 403 },
    );
  }

  const { status } = await req.json();
  if (!status) {
    return NextResponse.json({ message: 'Status is required' }, { status: 400 });
  }

  const order = await Order.findOne({ trackingId, shop: shop._id });
  if (!order)
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  if (order.status === 'cancelled') {
    return NextResponse.json(
      { message: 'Cannot update a cancelled order' },
      { status: 400 },
    );
  }
  // Update shop stats if necessary
  const stats = {
    [getOrderStatusAttribute(order.status)]: -1,
    [getOrderStatusAttribute(status)]: 1,
  }

  await updateShopStats(shop._id, stats);
  return NextResponse.json({ message: 'Order status updated successfully' });
});
