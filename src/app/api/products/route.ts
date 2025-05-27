import slugify from 'slugify';
import { SortOrder } from 'mongoose';
import { NextResponse } from 'next/server';

import { auth } from '@/auth';

import Product from '@/models/Product.model';
import Shop from '@/models/Shop.model';
import '@/models/Category.model';

import { errorHandler } from '@/lib/errorHandler';
import { createProductSchema } from '@/lib/schema/product';
import dbConnect from '@/lib/mongodb';

export const GET = errorHandler(async (request) => {
  await dbConnect();

  const { searchParams } = new URL(request.url);

  // Pagination
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const skip = (page - 1) * limit;

  // Filters
  const name = searchParams.get('name');
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  // Build a price filter object if needed
  const priceQuery: Record<string, number> = {};
  if (minPrice) priceQuery.$gte = Number(minPrice);
  if (maxPrice) priceQuery.$lte = Number(maxPrice);

  // Construct the filter query
  const query = {
    ...(name && { name }),
    ...(category && {
      categories: { $in: category.split(',') },
    }),
    ...(Object.keys(priceQuery).length && { price: priceQuery }),
  };

  // Sorting: map sort query to schema attribute
  const sortMap: Record<string, string> = {
    Curated: 'name',
    Latest: 'createdAt',
    Trending: 'discount',
  };

  const sort = searchParams.get('sort');
  const order =
    searchParams.get('order') || sortMap[sort || ''] === 'name'
      ? 'asc'
      : 'desc';

  const sortAttribute = sortMap[sort || ''] || 'name';
  const sortQuery = { [sortAttribute]: order as SortOrder };

  const products = await Product.find(query)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .populate('categories')
    .populate('shopId');

  return NextResponse.json(products);
});

export const POST = errorHandler(async (request) => {
  await dbConnect();

  const session = await auth();

  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const newProduct = createProductSchema.parse(body);

  const shop = await Shop.findById(newProduct.shopId);
  if (!shop)
    return NextResponse.json({ message: 'Shop not found' }, { status: 400 });

  if (session.user._id !== shop.ownerId)
    return NextResponse.json(
      { message: 'Insufficient Permission' },
      { status: 403 },
    );

  const product = new Product(newProduct);
  product.slug = slugify(product.name);
  await product.save();
  return NextResponse.json(product, { status: 201 });
});
