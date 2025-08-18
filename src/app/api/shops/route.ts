import { errorHandler } from '@/lib/errorHandler';
import dbConnect from '@/lib/mongodb';
import { createShopSchema } from '@/lib/schema/shop';
import { requireAuth } from '@/lib/apiAuth';
import Shop from '@/models/Shop.model';
import { NextResponse } from 'next/server';
import ShopStats from '@/models/ShopStats.model';

export const GET = errorHandler(async () => {
  await dbConnect();

  const user = await requireAuth();
  const shops = await Shop.find({ ownerId: user._id }).populate('stats');

  return NextResponse.json(shops);
});

export const POST = errorHandler(async (request) => {
  await dbConnect();

  const user = await requireAuth();

  const body = await request.json();
  const newShop = createShopSchema.parse(body);

  const shop = new Shop(newShop);
  shop.ownerId = user._id;
  const shopStat = new ShopStats({ shopId: shop._id });
  shop.stats = shopStat._id;
  await shop.save();
  await shopStat.save();
  return NextResponse.json(shop, { status: 201 });
});
