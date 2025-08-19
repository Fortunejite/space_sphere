import { NextResponse } from 'next/server';

import Product from '@/models/Product.model';
import '@/models/Category.model';
import '@/models/User.model';

import dbConnect from '@/lib/mongodb';
import { errorHandler } from '@/lib/errorHandler';
import { getShopBySubdomain } from '@/lib/shop';

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
