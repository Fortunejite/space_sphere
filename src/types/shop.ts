import { IShop } from '@/models/Shop.model';
import { IShopStats } from '@/models/ShopStats.model';
import { IUser } from '@/models/User.model';

export type ShopWithOwner = IShop & { ownerId: IUser };

export type ShopWithStats = Omit<IShop, 'stats'> & {
  stats: IShopStats;
};
export type ShopWithOwnerAndStats = Omit<IShop, 'stats'> & {
  ownerId: IUser;
  stats: IShopStats;
};