import { NextResponse } from 'next/server';

import { auth } from '@/auth';

import Category from '@/models/Category.model';

import { errorHandler } from '@/lib/errorHandler';
import dbConnect from '@/lib/mongodb';

export const GET = errorHandler(async () => {
  await dbConnect();

  const categories = await Category.find({ parent: null })
    .sort({ name: 1 })
    .populate('subcategories')
    .lean({ virtuals: true });

  return NextResponse.json(categories);
});

export const POST = errorHandler(async (request) => {
  await dbConnect();

  const session = await auth();
  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { name, parent } = await request.json();

  const { user } = session;

  if (!user || !user.isAdmin)
    return NextResponse.json(
      { message: 'Insufficient Permission' },
      { status: 403 },
    );
  const category = new Category({ name, parent });
  await category.save();
  return NextResponse.json({ message: 'Success' });
});
