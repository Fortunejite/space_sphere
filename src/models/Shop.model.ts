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
    status: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active',
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
