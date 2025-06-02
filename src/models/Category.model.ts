import { InferSchemaType, Schema, Types, model, models } from 'mongoose';
import slugify from 'slugify';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: [true, 'Category already exists'],
      trim: true,
    },
    parent: {
      type: Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: [true, 'Slug already exists'],
      index: true
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

categorySchema.pre('validate', async function (next) {
  if (this.isModified('name') || !this.slug)
    this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

type inferredFields = InferSchemaType<typeof categorySchema>;
export type ICategory = {
  _id: Types.ObjectId;
} & inferredFields;

const Category = models.Category || model('Category', categorySchema);
export default Category;
