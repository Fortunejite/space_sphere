import { InferSchemaType, Schema, Types, model, models } from 'mongoose';

const itemSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    variantIndex: { type: Number },
  },
  { _id: false },
);

const cartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    shops: [
      {
        shopId: {
          type: Types.ObjectId,
          ref: 'Shop',
          required: true,
        },
        items: [itemSchema],
      },
    ],
  },
  { timestamps: true },
);

export type inferredFields = InferSchemaType<typeof cartSchema>;
export type ICart = {
  _id: Types.ObjectId;
} & inferredFields;

const Cart = models.Cart || model('Cart', cartSchema);
export default Cart;
