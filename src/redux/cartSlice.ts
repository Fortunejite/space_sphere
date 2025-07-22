import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { clientErrorHandler } from '@/lib/errorHandler';
import { IProduct } from '@/models/Product.model';
import { ICart } from '@/models/Cart.model';
import { IShop } from '@/models/Shop.model';

interface CustomCart extends Omit<ICart, 'shops'> {
  shops: {
    shopId: IShop;
    items: {
      productId: IProduct;
      quantity: number;
      variantIndex: number;
    }[];
  }[];
}

interface IInitialState {
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  cart: CustomCart | null;
}

const initialState: IInitialState = {
  cart: null,
  status: 'idle',
  error: null,
};

/** Helper to wrap axios calls + error mapping */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function wrapRequest<T>(fn: () => Promise<T>, rejectWithValue: any) {
  try {
    return await fn();
  } catch (err) {
    const error = clientErrorHandler(err);
    console.error(error);
    return rejectWithValue(error);
  }
}

/** Build URLSearchParams for a shop */
function shopParams(shopId: string) {
  const params = new URLSearchParams();
  params.set('shopId', shopId);
  return { params };
}

/** Thunks */
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) =>
    wrapRequest(
      () => axios.get<CustomCart>('/api/cart').then((r) => r.data),
      rejectWithValue,
    ),
);

export const toggleCart = createAsyncThunk<
  CustomCart,
  { productId: string; shopId: string; variantIndex?: number },
  { rejectValue: string; state: { cart: IInitialState } }
>(
  'cart/toggleCart',
  async (
    { shopId, productId, variantIndex },
    { getState, rejectWithValue },
  ) => {
    const cart = getState().cart.cart;
    if (!cart) return rejectWithValue('Cart not found');
    const { shops } = cart;
    const shop = shops.find((s) => s.shopId._id.toString() === shopId);
    const params = shopParams(shopId);

    // decide which HTTP verb to use
    if (!shop) {
      return wrapRequest(
        () =>
          axios
            .post<CustomCart>('/api/cart', { productId, variantIndex }, params)
            .then((r) => r.data),
        rejectWithValue,
      );
    }

    const inCart = !!shop.items.find(
      (i) => i.productId._id.toString() === productId,
    );
    const method = inCart ? 'delete' : ('post' as const);
    return wrapRequest(
      () =>
        axios[method]<CustomCart>(
          `/api/cart/${productId}`,
          method === 'post' ? { variantIndex } : params,
          params,
        ).then((r) => r.data),
      rejectWithValue,
    );
  },
);

export const updateCart = createAsyncThunk<
  CustomCart,
  {
    shopId: string;
    productId: string;
    quantity?: number;
    variantIndex?: number;
  },
  { rejectValue: string; state: { cart: IInitialState } }
>(
  'cart/updateCart',
  async (
    { shopId, productId, quantity, variantIndex },
    { getState, rejectWithValue },
  ) => {
    const cart = getState().cart.cart;
    if (!cart) return rejectWithValue('Cart not found');
    const { shops } = cart;
    const shop = shops.find((s) => s.shopId._id.toString() === shopId);
    if (!shop) return rejectWithValue('Shop not found');

    const inCart = shop.items.some(
      (i) => i.productId._id.toString() === productId,
    );
    if (!inCart) return rejectWithValue('Item not found');

    return wrapRequest(
      () =>
        axios
          .patch<CustomCart>(
            `/api/cart/${productId}`,
            { quantity, variantIndex },
            shopParams(shopId),
          )
          .then((r) => r.data),
      rejectWithValue,
    );
  },
);

/** Slice */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // handle fulfilled for each thunk
    builder.addMatcher(
      isAnyOf(fetchCart.fulfilled, toggleCart.fulfilled, updateCart.fulfilled),
      (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload;
      },
    );

    // handle pending
    builder.addMatcher(
      isAnyOf(fetchCart.pending, toggleCart.pending, updateCart.pending),
      (state) => {
        state.status = 'loading';
        state.error = null;
      },
    );

    // handle errors
    builder.addMatcher(
      isAnyOf(fetchCart.rejected, toggleCart.rejected, updateCart.rejected),
      (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      },
    );
  },
});

export const selectInCart = (
  state: { cart: IInitialState },
  { productId, shopId }: { productId: string; shopId: string },
) => {
  const cart = state.cart.cart;
  if (!cart) return false;
  const shop = cart.shops.find((s) => s.shopId._id.toString() === shopId);
  return (
    !!shop && shop.items.some((i) => i.productId._id.toString() === productId)
  );
};

export const getShopCart = (state: { cart: IInitialState }, shopId: string | undefined) => {
  const cart = state.cart.cart;
  if (!cart || !shopId) return [];
  return (
    cart.shops.find((s) => s.shopId._id.toString() === shopId)?.items || []
  );
};

export const getShopItem = (
  state: { cart: IInitialState },
  shopId: string,
  productId: string,
) => {
  const cart = state.cart.cart;
  if (!cart) return null;
  return (
    cart.shops.find((s) => s.shopId._id.toString() === shopId)?.items || []
  ).find((i) => i.productId._id.toString() === productId);
};

export default cartSlice.reducer;
