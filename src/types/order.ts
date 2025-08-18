import { IOrder } from "@/models/Order.model";
import { IProduct } from "@/models/Product.model";
import { IShop } from "@/models/Shop.model";
import { IUser } from "@/models/User.model";

export type OrderWithShopAndUser = Omit<IOrder, 'shopId' | 'userId' | 'cartItems'> & {
  shopId: IShop;
  user: IUser;
  cartItems: {
    product: IProduct;
    quantity: number;
    variantIndex: number;
    price: string;
  }[];
}