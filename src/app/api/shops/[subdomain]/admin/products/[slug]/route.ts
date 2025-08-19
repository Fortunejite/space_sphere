import slugify from 'slugify';
import { NextResponse } from 'next/server';

import Product from '@/models/Product.model';
import '@/models/Category.model';
import '@/models/Shop.model';
import '@/models/User.model';

import dbConnect from '@/lib/mongodb';
import { errorHandler } from '@/lib/errorHandler';
import { createProductSchema } from '@/lib/schema/product';
import { getShopBySubdomain } from '@/lib/shop';
import { requireAuth } from '@/lib/apiAuth';
import { getProductStatusAttribute, updateShopStats } from '@/models/ShopStats.model';

export const PATCH = errorHandler(async (request, { params }) => {
  await dbConnect();

  const user = await requireAuth();

  const { slug, subdomain } = await params;
  if (!slug || !subdomain) {
    return NextResponse.json(
      { message: 'Product Slug and Shop Subdomain are required' },
      { status: 400 },
    );
  }
  const body = await request.json();
  const updatedProduct = createProductSchema.parse(body);

  const shop = await getShopBySubdomain(subdomain);

  if (user._id !== shop.ownerId._id.toString())
    return NextResponse.json(
      { message: 'Insufficient Permission' },
      { status: 403 },
    );

  const product = await Product.findOneAndUpdate(
    { slug },
    { ...updatedProduct, slug: slugify(updatedProduct.name) },
  )
    .populate('shopId')
    .populate('categories')
    .populate('reviews.user');

  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }

  if (updatedProduct.status !== product.status) {
    // Update the shop's product count if status changes
    await updateShopStats(shop._id, {
      [getProductStatusAttribute(product.status)]: -1,
      [getProductStatusAttribute(updatedProduct.status)]: 1,
    });
  }
  return NextResponse.json(updatedProduct);
});

export const DELETE = errorHandler(async (_, { params }) => {
  const user = await requireAuth();

  const { slug, subdomain } = await params;
  if (!slug || !subdomain) {
    return NextResponse.json(
      { message: 'Product Slug and Shop Subdomain are required' },
      { status: 400 },
    );
  }

  const shop = await getShopBySubdomain(subdomain);
  
  if (user._id !== shop.ownerId._id.toString())
    return NextResponse.json(
      { message: 'Insufficient Permission' },
      { status: 403 },
    );

  const product = await Product.findOne({ slug, shopId: shop._id });
  if (!product)
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });

  product.isDeleted = true;
  await product.save();

  // Update the shop's product count
  const stats = {
    [getProductStatusAttribute(product.status)]: -1,
    deletedProducts: 1,
  };
  await updateShopStats(shop._id, stats);
  return NextResponse.json({ message: 'Deleted successfully' });
});