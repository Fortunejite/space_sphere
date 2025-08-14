import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/utils';

import dbConnect from '@/lib/mongodb';
import { errorHandler } from '@/lib/errorHandler';
import Cart from '@/models/Cart.model';
import '@/models/Product.model';
import '@/models/Shop.model';
import { getShopBySubdomain } from '@/lib/shop';

await dbConnect();

export const GET = errorHandler(async (_, { params }) => {
  const user = await requireAuth();
  const { subdomain } = await params;
  if (!subdomain) {
    throw Object.assign(new Error('Shop Subdomain param is required'), {
      status: 400,
    });
  }
  const shop = await getShopBySubdomain(subdomain);
  const cart = await Cart.findOneAndUpdate(
    { user: user._id, 'shops.shopId': shop._id },
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
    .populate('shops.shopId')
    .populate('shops.items.productId')
    .lean();

  return NextResponse.json(cart);
});

export const POST = errorHandler(async (request, { params }) => {
  const user = await requireAuth();
  const { subdomain } = await params;
  if (!subdomain) {
    throw Object.assign(new Error('Shop Subdomain param is required'), {
      status: 400,
    });
  }
  const shop = await getShopBySubdomain(subdomain);
  const shopId = shop._id;

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
