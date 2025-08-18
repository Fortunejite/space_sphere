import { ICategory } from "@/models/Category.model";
import { IProduct } from "@/models/Product.model";
import { IShop } from "@/models/Shop.model";
import { IUser } from "@/models/User.model";

export type ProductWithCategory = Omit<IProduct, 'categories'> & {
  categories: ICategory[];
};

export type ProductWithShopAndCategory = Omit<IProduct, 'categories'> & {
  categories: ICategory[];
  shopId: IShop;
};

export type ProductWithShop = IProduct & {
  shopId: IShop;
};

export type ProductWithShopAndCategoryAndReviews = Omit<IProduct, 'categories'> & {
  categories: ICategory[];
  shopId: IShop;
  reviews: {
    user: IUser;
    rating: number;
    comment: string;
  }[];
};

export type ProductWithCategoryAndReviews = Omit<IProduct, 'categories'> & {
  _id: string;
  categories: ICategory[];
  reviews: {
    user: IUser;
    rating: number;
    comment: string;
  }[];
};