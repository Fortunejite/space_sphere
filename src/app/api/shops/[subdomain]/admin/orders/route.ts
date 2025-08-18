import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { requireAuth } from '@/lib/apiAuth';

import { errorHandler } from '@/lib/errorHandler';

import Order from '@/models/Order.model';
import '@/models/Product.model';
import dbConnect from '@/lib/mongodb';
import { getShopBySubdomain } from '@/lib/shop';

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

  if (user._id !== shop.ownerId._id.toString()) {
    return NextResponse.json(
      { message: 'Insufficient Permission' },
      { status: 403 },
    );
  }

  const orders = await Order.find({ shop: shop._id })
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
