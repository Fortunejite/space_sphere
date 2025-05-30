import { errorHandler } from '@/lib/errorHandler';
import dbConnect from '@/lib/mongodb';
import Shop from '@/models/Shop.model';
import { NextResponse } from 'next/server';

export const GET = errorHandler(async (_, { params }) => {
  await dbConnect();

  const { subdomain } = await params;

  const shop = await Shop.findOne({ subdomain });

  if (!shop)
    return NextResponse.json({ message: 'NOT_FOUND' }, { status: 404 });

  return NextResponse.json(shop);
});
