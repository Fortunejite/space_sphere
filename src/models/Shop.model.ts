import { InferSchemaType, Schema, Types, model, models } from 'mongoose';

const shopSchema = new Schema(
  {
    ownerId: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'A user is required'],
    },
    name: {
      type: String,
      required: true,
      minlength: [3, 'Name must be at least 3 characters long'],
    },
    subdomain: {
      type: String,
      unique: true,
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: 'Category',
      required: [true, 'A category is required'],
    },
    description: {
      type: String,
      required: [true, 'A description is required'],
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active',
    },
    stats: {
      type: Types.ObjectId,
      ref: 'ShopStats',
      required: [true, 'Shop stats are required'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'NGN',
    },
    logo: {
      type: String,
      required: false,
    },
    socialLinks: {
      type: [String],
      validate: {
        validator: (v: string[]) => v.every((link) => /^https?:\/\//.test(link)),
        message: 'Social links must be valid URLs',
      },
      default: [],
    },
  },
  { timestamps: true },
);
export type inferredFields = InferSchemaType<typeof shopSchema>;
export type IShop = {
  _id: Types.ObjectId;
} & inferredFields;

const Shop = models.Shop || model('Shop', shopSchema);
export default Shop;
