import slugify from 'slugify';
import { NextResponse } from 'next/server';
import Product from '@/models/Product.model';
import '@/models/Category.model';

import { errorHandler } from '@/lib/errorHandler';
import { createProductSchema } from '@/lib/schema/product';
import dbConnect from '@/lib/mongodb';
import { getShopBySubdomain } from '@/lib/shop';
import { requireAuth } from '@/lib/apiAuth';
import { SortOrder } from 'mongoose';
import { getProductStatusAttribute, updateShopStats } from '@/models/ShopStats.model';

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
  const search = searchParams.get('search');
  const category = searchParams.get('category');
  const status = searchParams.get('status');

  // Construct the filter query
  const query = {
    shopId: shop._id,
    ...(search && { name: { $regex: search, $options: 'i' } }),
    ...(category && {
      categories: { $in: category.split(',') },
    }),
    ...(status && { status }),
  };

  const sort = searchParams.get('sort');

  const sortQuery = { [sort || 'name']: 'asc' as SortOrder };
  const products = await Product.find(query)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .populate('categories')
    .populate('reviews.user');

  const totalCount = await Product.countDocuments(query);

  const hasMore = totalCount > skip + limit;

  return NextResponse.json({ products, totalCount, hasMore });
});

export const POST = errorHandler(async (request, { params }) => {
  await dbConnect();
  const { subdomain } = await params
  if (!subdomain) {
    return NextResponse.json(
      { message: 'Shop Subdomain is required' },
      { status: 400 },
    );
  }

  const user = await requireAuth();

  const body = await request.json();
  const newProduct = createProductSchema.parse(body);
  const shop = await getShopBySubdomain(subdomain);

  if (user._id !== shop.ownerId._id.toString())
    return NextResponse.json(
      { message: 'Insufficient Permission' },
      { status: 403 },
    );

  const product = new Product(newProduct);
  product.slug = slugify(product.name);
  product.shopId = shop._id
  await product.save();

  // Update the shop's product count
  const stats = {
    totalProducts: 1,
    [getProductStatusAttribute(product.status)]: 1,
  };
  await updateShopStats(shop._id, stats);
  return NextResponse.json(product, { status: 201 });
});
