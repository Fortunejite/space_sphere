import { IShop } from '@/models/Shop.model';
import { IUser } from '@/models/User.model';

export type ShopWithOwner = IShop & { owner: IUser };