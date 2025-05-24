import { InferSchemaType, Schema, model, models } from 'mongoose';

const shopSettingSchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  { timestamps: true },
);

export type inferredFields = InferSchemaType<typeof shopSettingSchema>;
export type IShopSetting = {
  _id: Schema.Types.ObjectId;
} & inferredFields;

const ShopSetting = models.ShopSetting || model('ShopSetting', shopSettingSchema);
export default ShopSetting;
