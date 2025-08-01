import { InferSchemaType, Schema, Types, model, models } from 'mongoose';

const generateTrackingId = () =>
  Math.floor(100000000 * Math.random() * 9000000000);

const orderSchema = new Schema(
  {
    shop: {
      type: Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true, // for tenant isolation queries
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
    },
    trackingId: {
      type: Number,
      default: generateTrackingId,
      unique: true,
    },
    cartItems: [
      {
        product: {
          type: Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
        variantIndex: { type: Number },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'canceled'],
      default: 'processing',
    },
    paymentMethod: {
      type: String,
      enem: ['online', 'delivery'],
      required: true,
    },
    paymentReference: {
      type: String,
      default: null,
      sparse: true,
      unique: true,
    },
    shipmentInfo: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      name: {
        type: String,
        required: [true, 'Name is required'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
      },
      phone: {
        type: String,
        required: [true, 'Phone is required'],
      },
    },
    note: {
      type: String,
    }
  },
  { timestamps: true },
);

export type inferredFields = InferSchemaType<typeof orderSchema>;
export type IOrder = {
  _id: Schema.Types.ObjectId;
} & inferredFields;

const Order = models.Order || model('Order', orderSchema);
export default Order;
