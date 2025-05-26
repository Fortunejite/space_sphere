import { errorHandler } from '@/lib/errorHandler';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category.model';
import Product from '@/models/Product.model';
import Shop from '@/models/Shop.model';
import User from '@/models/User.model';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export const GET = errorHandler(async () => {
  await dbConnect();

  await Promise.all([Product.deleteMany({}), Shop.deleteMany({})]);
  console.log('🗑️  Cleared existing data');

  const user = (await User.find())[0];

  // 2) Create demo shop
  const shop = await Shop.create({
    ownerId: user._id,
    name: 'Demo Shop',
    subdomain: 'demo-shop',
    // …any required shop fields…
  });
  console.log(`🏬 Created Shop: ${shop._id}`);

  const categories = await Category.find();

  const products = [
    {
      shopId: shop._id,
      name: 'Wireless Headphones',
      slug: 'wireless-headphones',
      description: 'High-quality over-ear wireless headphones',
      categories: [categories[0]._id],
      tags: ['audio', 'wireless', 'music'],
      variants: [
        {
          attributes: { color: 'black' },
          price: 99.99,
          stock: 50,
          isDefault: true,
        },
        { attributes: { color: 'white' }, price: 109.99, stock: 30 },
      ],
      price: 99.99,
      currency: 'USD',
      stock: 80,
      weight: 250, // grams
      dimensions: { length: 20, width: 18, height: 8 },
      shippingClass: 'standard',
      taxClass: 'general',
      discount: 10,
      saleStart: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      saleEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // in a week
      mainPic: '/placeholder.png',
      thumbnails: ['/placeholder.png', '/placeholder.png'],
      isFeatured: true,
      status: 'active',
      reviews: [
        {
          user: new mongoose.Types.ObjectId(),
          rating: 5,
          comment: 'Love these!',
        },
        {
          user: new mongoose.Types.ObjectId(),
          rating: 4,
          comment: 'Very comfy.',
        },
      ],
    },
    {
      shopId: shop._id,
      name: 'Men’s T-Shirt',
      slug: 'mens-tshirt',
      description: '100% cotton, various colors',
      categories: [categories[2]._id],
      tags: ['clothing', 'cotton'],
      variants: [
        {
          attributes: { size: 'S', color: 'navy' },
          price: 19.99,
          stock: 100,
          isDefault: true,
        },
        { attributes: { size: 'M', color: 'navy' }, price: 19.99, stock: 80 },
        { attributes: { size: 'L', color: 'navy' }, price: 19.99, stock: 60 },
      ],
      price: 19.99,
      currency: 'USD',
      stock: 240,
      weight: 200,
      dimensions: { length: 30, width: 25, height: 1 },
      shippingClass: 'standard',
      taxClass: 'general',
      mainPic: '/placeholder.png',
      thumbnails: ['/placeholder.png'],
      isFeatured: false,
      status: 'active',
      reviews: [
        {
          user: new mongoose.Types.ObjectId(),
          rating: 3,
          comment: 'Good, but shrinks a little.',
        },
      ],
    },
    {
      shopId: shop._id,
      name: '4K Action Camera',
      slug: '4k-action-camera',
      description: 'Waterproof, 4K video recording',
      categories: [categories[3]._id],
      tags: ['camera', '4k', 'outdoor'],
      variants: [], // no variants
      price: 249.99,
      currency: 'USD',
      stock: 25,
      weight: 150,
      dimensions: { length: 7, width: 4, height: 3 },
      shippingClass: 'express',
      taxClass: 'general',
      discount: 20,
      saleStart: new Date(),
      saleEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      mainPic: '/placeholder.png',
      thumbnails: ['/placeholder.png', '/placeholder.png', '/placeholder.png'],
      isFeatured: true,
      status: 'active',
      reviews: [],
    },
  ];

  await Product.insertMany(products);
  console.log(`✅ Seeded ${products.length} products`);

  return NextResponse.json({});
});
