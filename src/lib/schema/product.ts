import { z } from 'zod';

export const createProductSchema = z.object({
  shopId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  variant: z.array(
    z.object({
      attributes: z.record(z.string(), z.string()),
      price: z.number(),
      currency: z.string().optional(),
      stock: z.number().optional(),
      discount: z.number().optional(),
      isDefault: z.boolean(),
    }),
  ),
  price: z.number(),
  discount: z.number().optional(),
  currency: z.string().optional(),
  stock: z.number().optional(),
  weight: z.number().optional(),
  saleStart: z.date().optional(),
  saleEnd: z.date().optional(),
  mainPic: z.string(),
  thumbnails: z.array(z.string()),
  isFeatured: z.boolean(),
});
