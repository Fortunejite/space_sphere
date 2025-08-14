import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/utils';
import Order from '@/models/Order.model';

import dbConnect from '@/lib/mongodb';
import { errorHandler } from '@/lib/errorHandler';

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

  const { trackingId } = await params;
  if (!trackingId) {
    return NextResponse.json(
      { message: 'Tracking ID is required' },
      { status: 400 },
    );
  }

  const order = await Order.findOne({ trackingId, user: user._id });
  if (!order)
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  if (order.status !== 'processing') {
    return NextResponse.json(
      { message: 'Only processing orders can be cancelled' },
      { status: 400 },
    );
  }
  order.status = 'cancelled';
  await order.save();
  return NextResponse.json({ message: 'Cancelled successfully' });
});
