import slugify from 'slugify';
import { NextResponse } from 'next/server';

import { auth } from '@/auth';

import Product from '@/models/Product.model';
import Shop from '@/models/Shop.model';
import '@/models/Category.model';

import dbConnect from '@/lib/mongodb';
import { errorHandler } from '@/lib/errorHandler';
import { createProductSchema } from '@/lib/schema/product';

export const GET = errorHandler(async (req, { params }) => {
  await dbConnect();

  const { slug } = await params;
  if (!slug) {
    return NextResponse.json(
      { message: 'Product Slug is required' },
      { status: 400 },
    );
  }

  const { searchParams } = new URL(req.url);
  const shopId = searchParams.get('shopId');

  const product = await Product.findOne({ slug, ...(shopId && { shopId }) })
    .populate('shopId')
    .populate('categories')
    .populate('reviews.user');
  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
});

export const PATCH = errorHandler(async (request, { params }) => {
  await dbConnect();

  const session = await auth();
  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  if (!slug) {
    return NextResponse.json(
      { message: 'Product Slug is required' },
      { status: 400 },
    );
  }
  const body = await request.json();
  const updatedProduct = createProductSchema.parse(body);

  const shop = await Shop.findById(updatedProduct.shopId);
  if (!shop)
    return NextResponse.json({ message: 'Shop not found' }, { status: 400 });

  if (session.user._id !== shop.ownerId)
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

  const session = await auth();
  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  if (!slug) {
    return NextResponse.json(
      { message: 'Product Slug is required' },
      { status: 400 },
    );
  }

  const product = await Product.findOne({ slug });
  const shop = await Shop.findById(product.shopId);
  if (!shop)
    return NextResponse.json({ message: 'Shop not found' }, { status: 400 });

  if (session.user._id !== shop.ownerId)
    return NextResponse.json(
      { message: 'Insufficient Permission' },
      { status: 403 },
    );

  product.isDeleted = true;
  await product.save();
  return NextResponse.json({ message: 'Deleted sucessfully' });
});
