import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientErrorHandler } from '@/lib/errorHandler';
import axios from 'axios';
import { ICategory } from '@/models/Category.model';

interface IInitialState {
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  categories: ICategory[];
}

// Thunks for handling async operations
export const fetchCategories = createAsyncThunk(
  'catgegory/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/categories');
      return response.data;
    } catch (error) {
      const errorMessage = clientErrorHandler(error);
      return rejectWithValue(errorMessage);
    }
  },
);

export const addCategory = createAsyncThunk(
  'brand/addCategory',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/admin/categories', { name });
      return response.data;
    } catch (error) {
      const errorMessage = clientErrorHandler(error);
      return rejectWithValue(errorMessage);
    }
  },
);

export const modifyCategory = createAsyncThunk(
  'brand/modifyCategory',
  async ({ id, name }: { id: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/admin/brands/${id}`, { name });
      return response.data;
    } catch (error) {
      const errorMessage = clientErrorHandler(error);
      return rejectWithValue(errorMessage);
    }
  },
);

export const deleteBrand = createAsyncThunk(
  'brand/deleteBrand',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/admin/brands/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = clientErrorHandler(error);
      return rejectWithValue(errorMessage);
    }
  },
);

const initialState: IInitialState = {
  categories: [],
  status: 'idle',
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchBrands
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Handle addCategory
    builder
      .addCase(addCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = [...state.categories, action.payload];
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Handle modifyCategory
    builder
      .addCase(modifyCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(modifyCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = state.categories.map((category) => {
          if (category._id === action.payload._id) {
            return action.payload;
          }
          return category;
        });
      })
      .addCase(modifyCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Handle deleteBrand
    // builder
    //   .addCase(deleteBrand.pending, (state) => {
    //     state.status = 'loading';
    //   })
    //   .addCase(deleteBrand.fulfilled, (state, action) => {
    //     state.status = 'succeeded';
    //     state.brands = state.brands.filter(
    //       (brand) => brand._id !== action.payload,
    //     );
    //   })
    //   .addCase(deleteBrand.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload as string;
    //   });
  },
});

export default categorySlice.reducer;

// export const getBrandByName = (
//   state: {
//     brand: IInitialState;
//   },
//   brandName: IBrand['name'],
// ) => state.brand.brands.find((brand) => brand.name === brandName);

// export const getBrandById = (
//   state: {
//     brand: IInitialState;
//   },
//   brandId: IBrand['_id'] | string,
// ) => state.brand.brands.find((brand) => brand._id === brandId);
