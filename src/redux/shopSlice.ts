import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientErrorHandler } from '@/lib/errorHandler';
import axios from 'axios';
import { IShop } from '@/models/Shop.model';
import { IUser } from '@/models/User.model';

type CustomShop = IShop & { ownerId: IUser };

interface IInitialState {
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  shop: CustomShop;
}

// Thunks for handling async operations
export const fetchShop = createAsyncThunk(
  'catgegory/fetchShop',
  async (domain: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/shops/${domain}`);
      return response.data;
    } catch (error) {
      const errorMessage = clientErrorHandler(error);
      return rejectWithValue(errorMessage);
    }
  },
);

const initialState: IInitialState = {
  shop: {} as CustomShop,
  status: 'idle',
  error: null,
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchShop
    builder
      .addCase(fetchShop.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShop.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shop = action.payload;
      })
      .addCase(fetchShop.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default shopSlice.reducer;