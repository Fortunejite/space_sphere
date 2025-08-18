import { SortOrder } from 'mongoose';
import { NextResponse } from 'next/server';
import Product from '@/models/Product.model';
import '@/models/Category.model';

import { errorHandler } from '@/lib/errorHandler';
import dbConnect from '@/lib/mongodb';
import { getShopBySubdomain } from '@/lib/shop';

export const GET = errorHandler(async (request, { params }) => {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const { subdomain } = await params;
  if (!subdomain) {
    return NextResponse.json(
      { message: 'Shop Subdomain is required' },
      { status: 400 },
    );
  }

  const shop = await getShopBySubdomain(subdomain);

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
    shopId: shop._id,
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
    .populate('categories');

  return NextResponse.json(products);
});
