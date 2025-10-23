import { IOrder } from "@/models/Order.model";
import { IProduct } from "@/models/Product.model";
import { IShop } from "@/models/Shop.model";
import { IUser } from "@/models/User.model";

export type OrderWithShopAndUser = Omit<IOrder, 'shopId' | 'userId'> & {
  shopId: IShop;
  user: IUser;
}

export type OrderWithCartItems = Omit<IOrder, 'cartItems'> & {
  cartItems: {
    product: IProduct;
    quantity: number;
    variantIndex: number;
    price: string;
  }[];
}