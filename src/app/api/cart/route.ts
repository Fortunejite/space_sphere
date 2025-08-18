import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { errorHandler } from '@/lib/errorHandler';
import Cart from '@/models/Cart.model';
import '@/models/Product.model';
import '@/models/Shop.model';
import { requireAuth } from '@/lib/apiAuth';

await dbConnect();

export const GET = errorHandler(async () => {
  const user = await requireAuth();
  // Use lean() if you don't need full mongoose documents
  const cart = await Cart.findOneAndUpdate(
    { user: user._id },
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
    .populate('shops.shopId')
    .populate('shops.items.productId')
    .lean();

  return NextResponse.json(cart);
});

export const POST = errorHandler(async (request) => {
  const user = await requireAuth();

  const url = new URL(request.url);
  const shopId = url.searchParams.get('shopId');
  if (!shopId) {
    throw Object.assign(new Error('Shop ID param is required'), { status: 400 });
  }

  const { productId, variantIndex } = await request.json();
  if (!productId) {
    throw Object.assign(new Error('Product ID is required'), { status: 400 });
  }

  // First check if shop already in cart
  const existing = await Cart.exists({
    user: user._id,
    'shops.shopId': shopId,
  });
  if (existing) {
    throw Object.assign(new Error('Shop already exists'), { status: 400 });
  }

  // Build the item
  const item = variantIndex != null
    ? { productId, variantIndex }
    : { productId };

  // Atomic add-to-set
  const updatedCart = await Cart.findOneAndUpdate(
    { user: user._id },
    { $push: { shops: { shopId, items: [item] } } },
    { new: true }
  ).populate('shops.shopId')
   .populate('shops.items.productId')
   .lean();

  return NextResponse.json(updatedCart!);
});
