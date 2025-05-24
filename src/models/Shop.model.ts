import { InferSchemaType, Schema, model, models } from 'mongoose';

const shopSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
  _id: Schema.Types.ObjectId;
} & inferredFields;

const Shop = models.Shop || model('Shop', shopSchema);
export default Shop;
