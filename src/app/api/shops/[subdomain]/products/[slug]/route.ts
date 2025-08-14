import slugify from 'slugify';
import { NextResponse } from 'next/server';

import Product from '@/models/Product.model';
import '@/models/Category.model';

import dbConnect from '@/lib/mongodb';
import { errorHandler } from '@/lib/errorHandler';
import { createProductSchema } from '@/lib/schema/product';
import { getShopBySubdomain } from '@/lib/shop';
import { requireAuth } from '@/lib/utils';

export const GET = errorHandler(async (_, { params }) => {
  await dbConnect();

  const { slug, subdomain } = await params;
  if (!slug || !subdomain) {
    return NextResponse.json(
      { message: 'Product Slug and Shop Subdomain are required' },
      { status: 400 },
    );
  }

  const shop = await getShopBySubdomain(subdomain);

  const product = await Product.findOne({ slug, shopId: shop._id })
    .populate('categories')
    .populate('reviews.user');
  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
});

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
  if (!shop)
    return NextResponse.json({ message: 'Shop not found' }, { status: 400 });

  if (user._id !== shop.ownerId)
    return NextResponse.json(
      { message: 'Insufficient Permission' },
      { status: 403 },
    );

  const product = await Product.findOneAndUpdate(
    { slug },
    { ...updatedProduct, slug: slugify(updatedProduct.name) },
    {
      new: true,
    },
  )
    .populate('shopId')
    .populate('categories')
    .populate('reviews.user');

  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
});

export const DELETE = errorHandler(async (_, { params }) => {
  await dbConnect();

  const user = await requireAuth();

  const { slug, subdomain } = await params;
  if (!slug || !subdomain) {
    return NextResponse.json(
      { message: 'Product Slug and Shop Subdomain are required' },
      { status: 400 },
    );
  }
  const product = await Product.findOne({ slug });
  const shop = await getShopBySubdomain(subdomain);
  if (!shop)
    return NextResponse.json({ message: 'Shop not found' }, { status: 400 });

  if (user._id !== shop.ownerId)
    return NextResponse.json(
      { message: 'Insufficient Permission' },
      { status: 403 },
    );

  product.isDeleted = true;
  await product.save();
  return NextResponse.json({ message: 'Deleted sucessfully' });
});
