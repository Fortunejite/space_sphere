import { InferSchemaType, Schema, model, models } from 'mongoose';

const productSchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    name: {
      type: String,
      required: true,
      minlength: [3, 'Name must be at least 3 characters long'],
    },
    description: { type: String },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    discount: {
      type: Number,
      default: 0,
    },
    mainPic: {
      type: String,
      required: [true, 'mainPic is required'],
    },
    thumbnails: [
      {
        type: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sales: { type: Number, default: 0 },
    size: {
      type: Number,
    },
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
        comment: String,
      },
    ],
  },
  { timestamps: true },
);
export type inferredFields = InferSchemaType<typeof productSchema>;
export type IProduct = {
  _id: Schema.Types.ObjectId;
} & inferredFields;

const Product = models.Product || model('Product', productSchema);
export default Product;
