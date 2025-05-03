import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

// --------------- Types ---------------
export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  reviewMessage: string;
  reviewValue: number;
  createdAt: string;
  updatedAt: string;
}

interface ReviewState {
  isLoading: boolean;
  reviews: Review[];
  error: string | null;
}

// --------------- Initial State ---------------
const initialState: ReviewState = {
  isLoading: false,
  reviews: [],
  error: null,
};

// --------------- Thunks ---------------
export const getReviews = createAsyncThunk<Review[], string, { rejectValue: string }>(
  "review/getReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/shop/review/${productId}`);
      return response.data.data; // Assuming { success: true, data: reviews }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data.message || "Failed to fetch reviews");
    }
  }
);

export const addReview = createAsyncThunk<Review, { productId: string; userId: string; userName: string; reviewMessage: string; reviewValue: number }, { rejectValue: string }>(
  "review/addReview",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/shop/review`, formData);
      return response.data.data; // Assuming { success: true, data: newReview }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data.message || "Failed to add review");
    }
  }
);

export const updateReview = createAsyncThunk<
  Review, 
  { reviewId: string; productId: string; userId: string; userName: string; reviewMessage: string; reviewValue: number }, 
  { rejectValue: string }
>(
  "review/updateReview",
  async (formData, { rejectWithValue }) => {
    try {
      // Extract reviewId from formData and remove it from the payload
      const { reviewId, ...reviewData } = formData;
      
      // Send PUT request with the reviewId in the URL and the rest of the data in the request body
      const response = await axios.put(`${API_URL}/shop/review/${reviewId}`, reviewData);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data.message || "Failed to update review");
    }
  }
);

export const deleteReview = createAsyncThunk<Review, string, { rejectValue: string }>(
  "review/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/shop/review/${reviewId}`);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data.message || "Failed to delete review");
    }
  }
);

// --------------- Slice ---------------
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Reviews
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
        state.error = action.payload || "Something went wrong";
      })
      // Add Review
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.isLoading = false;
        state.reviews.push(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
      })
      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.isLoading = false;
        const index = state.reviews.findIndex((review) => review._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update review";
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.isLoading = false;
        state.reviews = state.reviews.filter((review) => review._id !== action.payload._id);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete review";
      });
  },
});

export default reviewSlice.reducer;