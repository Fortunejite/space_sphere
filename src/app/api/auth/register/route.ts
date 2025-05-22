import { errorHandler } from '@/lib/errorHandler';
import dbConnect from '@/lib/mongodb';
import { createUserSchema } from '@/lib/schema/auth';
import User from '@/models/User.model';
import { NextResponse } from 'next/server';

export const POST = errorHandler(async (request: Request) => {
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

  return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
});
