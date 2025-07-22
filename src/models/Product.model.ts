import { Schema, Types, model, models } from 'mongoose';
import slugify from 'slugify';

const variantSchema = new Schema(
  {
    attributes: { type: Map, of: String }, // e.g. { size: 'M', color: 'red' }
    isDefault: { type: Boolean, default: false },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    shopId: {
      type: Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true, // for tenant isolation queries
    },

    // core product info
    name: { type: String, required: true, minlength: 3 },
    slug: { type: String, required: true },
    description: {
      type: String,
    },

    // categorization
    categories: [{ type: Types.ObjectId, ref: 'Category' }],
    tags: [String],

    // variants & pricing
    variants: [variantSchema],
    price: { type: Number, required: true }, // fallback if no variants
    currency: { type: String, default: 'USD' }, // fallback currency

    // inventory
    stock: { type: Number, default: 0 }, // fallback if no variants

    // shipping & tax
    weight: Number, // in grams (or unit)
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    shippingClass: { type: String }, // e.g. 'standard', 'express'
    taxClass: { type: String }, // e.g. 'general', 'reduced', 'digital'

    // sales & promotions
    discount: { type: Number, default: 0 }, // overall discount %
    saleStart: Date,
    saleEnd: Date,

    // media
    mainPic: { type: String, required: true },
    thumbnails: [String],

    // featured, status & soft‐delete
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'active',
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,

    // reviews
    reviews: [
      {
        user: {
          type: Types.ObjectId,
          ref: 'User',
          required: [true, 'A reviewer is required'],
        },
        rating: {
          type: Number,
          min: 0,
          max: 5,
          required: [true, 'Provide a rating'],
        },
        comment: String,
        createdAt: { type: Date, default: () => new Date() },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// compound index to enforce unique slug per shop
productSchema.index({ shopId: 1, slug: 1 }, { unique: true });

productSchema.pre('validate', async function (next) {
  if (this.isModified('name') || !this.slug)
    this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

productSchema.path('saleEnd').validate(function (value: Date) {
  if (!value || !this.saleStart) return true;
  return this.saleStart < value;
}, '`saleEnd` must be after `saleStart`');

type InferredFields = {
  shopId: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  categories: Types.ObjectId[];
  tags: string[];
  variants: Array<{
    attributes: Map<string, string>;
    isDefault: boolean;
  }>;
  price: number;
  currency: string;
  stock: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  shippingClass?: string;
  taxClass?: string;
  discount: number;
  saleStart?: Date;
  saleEnd?: Date;
  mainPic: string;
  thumbnails: string[];
  isFeatured: boolean;
  status: 'draft' | 'active' | 'archived';
  isDeleted: boolean;
  deletedAt?: Date;
  reviews: Array<{
    user: Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
};
export type IProduct = InferredFields & { _id: Types.ObjectId };

const some: IProduct = {} as IProduct
some.name = ''

const Product = models.Product || model('Product', productSchema);
export default Product;
