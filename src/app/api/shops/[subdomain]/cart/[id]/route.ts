import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/utils';

import dbConnect from '@/lib/mongodb';
import { errorHandler } from '@/lib/errorHandler';
import Cart from '@/models/Cart.model';
import '@/models/Product.model';
import '@/models/Shop.model';
import { getShopBySubdomain } from '@/lib/shop';

// ensure we’re connected once
await dbConnect();

export const PATCH = errorHandler(async (request, { params }) => {
  const user = await requireAuth();
  const { id, subdomain } = await params;
  if (!id || !subdomain) {
    return NextResponse.json(
      { message: 'Product ID and Shop Subdomain are required' },
      { status: 400 },
    );
  }

  const shop = await getShopBySubdomain(subdomain);

  const { quantity, variantIndex } = await request.json();
  if (quantity == null && variantIndex == null) {
    return NextResponse.json({ message: 'Nothing to update' }, { status: 400 });
  }

  // update the matching item in the matching shop
  const updatedCart = await Cart.findOneAndUpdate(
    {
      user: user._id,
      'shops.shopId': shop._id,
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
      arrayFilters: [{ 'shop.shopId': shop._id }, { 'item.productId': id }],
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
  const { id, subdomain } = await params;
  if (!id || !subdomain) {
    return NextResponse.json(
      { message: 'Product ID and Shop Subdomain are required' },
      { status: 400 },
    );
  }

  const shop = await getShopBySubdomain(subdomain);

  const { quantity, variantIndex } = await request.json();

  const existingProduct = await Cart.findOne({
    user: user._id,
    'shops.shopId': shop._id,
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
      'shops.shopId': shop._id,
    },
    {
      $push: { 'shops.$[shop].items': newItem },
    },
    {
      new: true,
      arrayFilters: [{ 'shop.shopId': shop._id }],
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
  const { id, subdomain } = await params;
  if (!id || !subdomain) {
    return NextResponse.json(
      { message: 'Product ID and Shop Subdomain are required' },
      { status: 400 },
    );
  }

  const shop = await getShopBySubdomain(subdomain);

  // 1) pull out the item from that shop
  await Cart.updateOne(
    { user: user._id, 'shops.shopId': shop._id },
    { $pull: { 'shops.$.items': { productId: id } } },
  );

  // 2) if that shop now has no items, pull the shop entirely
  await Cart.updateOne(
    { user: user._id },
    { $pull: { shops: { shopId: shop._id, items: { $size: 0 } } } },
  );

  // 3) return the fresh cart
  const cart = await Cart.findOne({ user: user._id })
    .populate('shops.shopId')
    .populate('shops.items.productId')
    .lean();

  return NextResponse.json(cart);
});
