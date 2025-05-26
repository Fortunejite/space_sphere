import { errorHandler } from '@/lib/errorHandler';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category.model';
import { NextResponse } from 'next/server';

export const GET = errorHandler(async () => {
  await dbConnect();

  await Category.deleteMany({});
  console.log('🧹  Cleared categories collection');

  // 3. Define root categories
  const rootData = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Books', slug: 'books' },
    { name: 'Clothings', slug: 'clothings' },
  ];
  const roots = await Category.insertMany(rootData);
  console.log(`✅  Inserted ${roots.length} root categories`);

  // 4. Define subcategories (one level only!)
  const subData = [
    // Electronics subcategories
    {
      name: 'Smartphones',
      parent: roots.find((c) => c.name === 'Electronics')._id,
      slug: 'smartphones',
    },
    {
      name: 'Laptops',
      parent: roots.find((c) => c.name === 'Electronics')._id,
      slug: 'laptops',
    },
    // Books subcategories
    {
      name: 'Fiction',
      parent: roots.find((c) => c.name === 'Books')._id,
      slug: 'fiction',
    },
    {
      name: 'Non-fiction',
      parent: roots.find((c) => c.name === 'Books')._id,
      slug: 'non-fiction',
    },
    // Clothing subcategories
    {
      name: 'Men',
      parent: roots.find((c) => c.name === 'Clothing')._id,
      slug: 'men',
    },
    {
      name: 'Women',
      parent: roots.find((c) => c.name === 'Clothing')._id,
      slug: 'women',
    },
  ];
  const subs = await Category.insertMany(subData);
  console.log(`✅  Inserted ${subs.length} subcategories`);

  // 5. Done
  console.log('🎉  Seeding complete!');

  return NextResponse.json({});
});
