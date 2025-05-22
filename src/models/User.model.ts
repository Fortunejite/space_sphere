import { InferSchemaType, Schema, model, models } from 'mongoose';
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already exists"],
      minlength: [3, "Username must be at least 3 characters long"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
      min: [6, 'Must be atleast 6 characters'],
    },
    avatar: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
    },
    // favourite: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Product',
    //   },
    // ],
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  this.username = this.username.trim();
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password!, 10);
  next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export type inferredFields = InferSchemaType<typeof userSchema>;
export type IUser = {
  _id: Schema.Types.ObjectId;
} & inferredFields;

const User = models.User || model('User', userSchema);
export default User;
