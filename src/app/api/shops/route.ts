import { errorHandler } from '@/lib/errorHandler';
import dbConnect from '@/lib/mongodb';
import { createShopSchema } from '@/lib/schema/shop';
import { requireAuth } from '@/lib/utils';
import Shop from '@/models/Shop.model';
import { NextResponse } from 'next/server';

export const GET = errorHandler(async (request) => {
  await dbConnect();
  const { searchParams } = new URL(request.url);

  // Pagination
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const skip = (page - 1) * limit;

  const user = await requireAuth()
  const shops = await Shop.find({ ownerId: user._id }).skip(skip).limit(limit);

  return NextResponse.json(shops);
});

export const POST = errorHandler(async (request) => {
  await dbConnect();

  const user = await requireAuth();

  const body = await request.json();
  const newShop = createShopSchema.parse(body);

  const shop = new Shop(newShop);
  shop.ownerId = user._id;
  await shop.save();
  return NextResponse.json(shop, { status: 201 });
});
