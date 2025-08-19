import { NextResponse } from 'next/server';

import Product from '@/models/Product.model';
import '@/models/Category.model';

import dbConnect from '@/lib/mongodb';
import { errorHandler } from '@/lib/errorHandler';

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
