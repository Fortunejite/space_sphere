import { InferSchemaType, Schema, model, models } from 'mongoose';

const variantSchema = new Schema(
  {
    attributes: Schema.Types.Mixed, // e.g. { size: 'M', color: 'red' }
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    stock: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true, // for tenant isolation queries
    },

    // core product info
    name: { type: String, required: true, minlength: 3 },
    slug: { type: String, required: true},
    description: {
      type: String,
    },

    // categorization
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
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
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 0, max: 5 },
        comment: String,
        createdAt: { type: Date, default: () => new Date() },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// compound index to enforce unique slug per shop
productSchema.index({ shopId: 1, slug: 1 }, { unique: true });

productSchema.path('saleEnd').validate(function (value: Date) {
  if (!value || !this.saleStart) return true
  return this.saleStart < value;
}, '`saleEnd` must be after `saleStart`')

export type InferredProduct = InferSchemaType<typeof productSchema>;
export type IProduct = {
  _id: Schema.Types.ObjectId;
} & InferredProduct;

const Product = models.Product || model('Product', productSchema);
export default Product;
