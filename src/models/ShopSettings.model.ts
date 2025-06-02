import { InferSchemaType, Schema, Types, model, models } from 'mongoose';

const shopSettingSchema = new Schema(
  {
    shopId: {
      type: Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
  },
  { timestamps: true },
);

export type inferredFields = InferSchemaType<typeof shopSettingSchema>;
export type IShopSetting = {
  _id: Types.ObjectId;
} & inferredFields;

const ShopSetting = models.ShopSetting || model('ShopSetting', shopSettingSchema);
export default ShopSetting;
