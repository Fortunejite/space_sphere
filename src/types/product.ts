import { ICategory } from "@/models/Category.model";
import { IProduct } from "@/models/Product.model";
import { IShop } from "@/models/Shop.model";
import { IUser } from "@/models/User.model";

export type ProductWithCategory = IProduct & {
  categories: ICategory[];
};

export type ProductWithShopAndCategory = IProduct & {
  categories: ICategory[];
  shopId: IShop;
};

export type ProductWithShop = IProduct & {
  shopId: IShop;
};

export type ProductWithShopAndCategoryAndReviews = IProduct & {
  categories: ICategory[];
  shopId: IShop;
  reviews: {
    user: IUser;
    rating: number;
    comment: string;
  }[];
};