import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import { errorHandler } from '@/lib/errorHandler';
import Cart from '@/models/Cart.model';
import '@/models/Product.model';
import '@/models/Shop.model';

// ensure we’re connected once
await dbConnect();

// helper to require a valid session
async function requireAuth() {
  const session = await auth();
  if (!session) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 });
  }
  return session.user;
}

export const PATCH = errorHandler(async (request, { params }) => {
  const user = await requireAuth();
  const { id } = await params;

  const url = new URL(request.url);
  const shopId = url.searchParams.get('shopId');
  if (!shopId) {
    return NextResponse.json(
      { message: 'shopId query param required' },
      { status: 400 },
    );
  }

  const { quantity, variantIndex } = await request.json();
  if (quantity == null && variantIndex == null) {
    return NextResponse.json({ message: 'Nothing to update' }, { status: 400 });
  }

  // update the matching item in the matching shop
  const updatedCart = await Cart.findOneAndUpdate(
    {
      user: user._id,
      'shops.shopId': shopId,
      'shops.items.productId': id,
    },
    {
      ...(quantity != null && {
        $set: { 'shops.$[shop].items.$[item].quantity': quantity },
      }),
      ...(variantIndex != null && {
        $set: { 'shops.$[shop].items.$[item].variantIndex': variantIndex },
      }),
    },
    {
      new: true,
      arrayFilters: [{ 'shop.shopId': shopId }, { 'item.productId': id }],
    },
  )
    .populate('shops.shopId')
    .populate('shops.items.productId')
    .lean();

  if (!updatedCart) {
    return NextResponse.json(
      { message: 'Cart, shop, or item not found' },
      { status: 404 },
    );
  }

  return NextResponse.json(updatedCart);
});

export const POST = errorHandler(async (request, { params }) => {
  const user = await requireAuth();
  const { id } = await params;

  const url = new URL(request.url);
  const shopId = url.searchParams.get('shopId');
  if (!shopId) {
    return NextResponse.json(
      { message: 'shopId query param required' },
      { status: 400 },
    );
  }

  const { quantity, variantIndex } = await request.json();

  const existingProduct = await Cart.findOne({
    user: user._id,
    'shops.shopId': shopId,
    'shops.items.productId': id,
  });

  if (existingProduct)
    return NextResponse.json(
      { message: 'Product already in cart' },
      { status: 400 },
    );

  const newItem = {
    productId: id,
    ...(quantity != null && { quantity }),
    ...(variantIndex != null && { variantIndex }),
  };

  // update the matching item in the matching shop
  const updatedCart = await Cart.findOneAndUpdate(
    {
      user: user._id,
      'shops.shopId': shopId,
    },
    {
      $push: { 'shops.$[shop].items': newItem },
    },
    {
      new: true,
      arrayFilters: [{ 'shop.shopId': shopId }],
    },
  )
    .populate('shops.shopId')
    .populate('shops.items.productId')
    .lean();

  if (!updatedCart) {
    return NextResponse.json(
      { message: 'Cart, shop, or item not found' },
      { status: 404 },
    );
  }

  return NextResponse.json(updatedCart);
});

/**
 * DELETE /api/cart/[productId]?shopId=<shopId>
 * – removes an item; if the shop has no more items afterwards, removes the shop too
 */
export const DELETE = errorHandler(async (_request, { params }) => {
  const user = await requireAuth();
  const { id } = await params;

  const url = new URL(_request.url);
  const shopId = url.searchParams.get('shopId');
  if (!shopId) {
    return NextResponse.json(
      { message: 'shopId query param required' },
      { status: 400 },
    );
  }

  // 1) pull out the item from that shop
  await Cart.updateOne(
    { user: user._id, 'shops.shopId': shopId },
    { $pull: { 'shops.$.items': { productId: id } } },
  );

  // 2) if that shop now has no items, pull the shop entirely
  await Cart.updateOne(
    { user: user._id },
    { $pull: { shops: { shopId, items: { $size: 0 } } } },
  );

  // 3) return the fresh cart
  const cart = await Cart.findOne({ user: user._id })
    .populate('shops.shopId')
    .populate('shops.items.productId')
    .lean();

  return NextResponse.json(cart);
});
