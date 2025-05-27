import { auth } from '@/auth';
import { errorHandler } from '@/lib/errorHandler';
import dbConnect from '@/lib/mongodb';
import { createShopSchema } from '@/lib/schema/shop';
import Shop from '@/models/Shop.model';
import { NextResponse } from 'next/server';

export const GET = errorHandler(async () => {
  await dbConnect();

  const session = await auth();
  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { user } = session;

  const shops = await Shop.find({ ownerId: user._id });

  return NextResponse.json(shops);
});

export const POST = errorHandler(async (request) => {
  await dbConnect();

  const session = await auth();

  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const newShop = createShopSchema.parse(body);

  const shop = new Shop(newShop);
  shop.ownerId = session.user._id;
  await shop.save();
  return NextResponse.json(shop, { status: 201 });
});
