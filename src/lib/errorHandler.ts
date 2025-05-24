import axios from 'axios';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export const errorHandler =
  (handler: (request: Request) => Promise<NextResponse>) =>
  async (req: Request) => {
    try {
      return await handler(req);
    } catch (err) {
      console.error(err);

      // Zod validation error
      if (err instanceof ZodError) {
        const issues = err.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        return NextResponse.json(
          { error: 'ValidationError', issues },
          { status: 400 },
        );
      }

      // Mongoose validation error
      if (err instanceof mongoose.Error.ValidationError) {
        const issues = Object.values(err.errors).map((e) => ({
          path: e.path,
          message: e.message,
        }));
        return NextResponse.json(
          { error: 'MongooseValidationError', issues },
          { status: 400 },
        );
      }

      // Duplicate key (unique index)
      if ((err as { code: number }).code === 11000) {
        const field = Object.keys(
          (err as { keyValue: string }).keyValue ?? {},
        ).join(', ');
        return NextResponse.json(
          { error: 'DuplicateKeyError', message: `${field} already exists` },
          { status: 409 },
        );
      }

      // CastError (invalid ObjectId)
      if (err instanceof mongoose.Error.CastError) {
        return NextResponse.json(
          { error: 'CastError', message: `Invalid ${err.path}: ${err.value}` },
          { status: 400 },
        );
      }

      // Fallback
      return NextResponse.json(
        { error: 'InternalServerError', message: 'Something went wrong' },
        { status: 500 },
      );
    }
  };

export const clientErrorHandler = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data.message;
  }
  return (err as Error).message;
};
