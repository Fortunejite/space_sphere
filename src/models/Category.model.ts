import { InferSchemaType, Schema, model, models } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: [true, 'Category already exists'],
      trim: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
    },
  },
  {
    timestamps: true,
    toJson: { virtuals: true },
    toObject: { virtuals: true },
  },
);

categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

categorySchema.pre('save', async function (next) {
  this.slug = this.name.toLowerCase().split(' ').join('-');
  next();
});

type inferredFields = InferSchemaType<typeof categorySchema>;
export type ICategory = {
  _id: Schema.Types.ObjectId;
} & inferredFields;

const Category = models.Category || model('Category', categorySchema);
export default Category;
