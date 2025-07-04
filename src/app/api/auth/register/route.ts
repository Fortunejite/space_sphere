import { NextResponse } from 'next/server';

import { signIn } from '@/auth';

import User from '@/models/User.model';

import { errorHandler } from '@/lib/errorHandler';
import dbConnect from '@/lib/mongodb';
import { createUserSchema } from '@/lib/schema/auth';

export const POST = errorHandler(async (request) => {
  await dbConnect();

  const body = await request.json();
  const credentials = createUserSchema.parse(body);

  const availableUser = await User.findOne({ email: credentials.email });
  if (availableUser) {
    return NextResponse.json(
      { error: "EmailAlreadyExist", message: 'Email already exists' },
      { status: 400 },
    );
  }

  const user = new User(credentials);
  await user.save();

  await signIn('credentials', {...credentials, redirect: false})

  return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
});
