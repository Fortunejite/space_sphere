import { InferSchemaType, Schema, Types, model, models } from 'mongoose';

const dailyStatsSchema = new Schema({
  orders: { type: Number, default: 0 },
  revenueCents: { type: Number, default: 0 }
}, { _id: false });

const shopStatsSchema = new Schema({
  shopId: { type: String, required: true, unique: true, index: true },

  totalOrders: { type: Number, default: 0 },
  pendingOrders: { type: Number, default: 0 },
  shippedOrders: { type: Number, default: 0 },
  deliveredOrders: { type: Number, default: 0 },
  cancelledOrders: { type: Number, default: 0 },

  totalProducts: { type: Number, default: 0 },
  draftedProducts: { type: Number, default: 0 },
  activeProducts: { type: Number, default: 0 },
  deletedProducts: { type: Number, default: 0 },

  totalRevenueCents: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 }, // total sales across all products
  totalCustomers: { type: Number, default: 0 }, // unique customers
  daily: { type: Map, of: dailyStatsSchema, default: {} }
}, { timestamps: true });

export type inferredFields = InferSchemaType<typeof shopStatsSchema>;
export type IShopStats = {
  _id: Types.ObjectId;
} & inferredFields;

const ShopStats = models.ShopStats || model('ShopStats', shopStatsSchema);
export default ShopStats;

export const getOrderStatusAttribute = (status: string) => {
  switch (status) {
    case 'processing':
      return 'pendingOrders';
    case 'shipped':
      return 'shippedOrders';
    case 'delivered':
      return 'deliveredOrders';
    case 'cancelled':
      return 'cancelledOrders';
    default:
      return '';
  }
};

export const getProductStatusAttribute = (status: string) => {
  switch (status) {
    case 'active':
      return 'activeProducts';
    case 'draft':
      return 'draftedProducts';
    case 'deleted':
      return 'deletedProducts';
    default:
      return '';
  }
};

export const updateShopStats = async (shopId: string | Types.ObjectId, update: Partial<IShopStats>) => {
  return ShopStats.findOneAndUpdate(
    { shopId },
    { $inc: update },
    { new: true, upsert: true }
  );
};