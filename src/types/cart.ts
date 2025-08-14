import { ICart } from "@/models/Cart.model";
import { IProduct } from "@/models/Product.model";
import { IShop } from "@/models/Shop.model";

export type ItemInCart = {
  productId: IProduct;
  quantity: number;
  variantIndex: number;
};

export type CartWithItems = Omit<ICart, 'shops'> & {
  shops: {
    shopId: string;
    items: ItemInCart[];
  }[];
};

export type CartWithShopAndItems = Omit<ICart, 'shops'> & {
  shops: {
    shopId: IShop;
    items: ItemInCart[];
  }[];
};