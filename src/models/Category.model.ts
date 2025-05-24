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

// categorySchema.pre('save', async function (next) {
//   if (!this.parent) {
//     return next();
//   }

//   try {
//     const parentDoc = await this.constructor
//       .findById(this.parent)
//       .select('parent')
//       .lean();
//     if (!parentDoc) {
//       return next(new Error('Parent category does not exist'));
//     }
//     if (parentDoc.parent) {
//       return next(new Error('Cannot attach a subcategory'));
//     }
//     next();
//   } catch (err) {
//     next(err as undefined);
//   }
// });

type inferredFields = InferSchemaType<typeof categorySchema>;
export type ICategory = {
  _id: Schema.Types.ObjectId;
} & inferredFields;

const Category = models.Category || model('Category', categorySchema);
export default Category;
