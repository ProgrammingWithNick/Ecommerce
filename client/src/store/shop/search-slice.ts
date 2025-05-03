import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Type definitions
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand?: string;
  salePrice?: number;
  totalStock?: number;
}

interface SearchState {
  isLoading: boolean;
  searchResults: Product[];
  recentSearches: string[];
  error: string | null;
}

// Initial state
const initialState: SearchState = {
  isLoading: false,
  searchResults: [],
  recentSearches: loadRecentSearches(),
  error: null
};

// Load recent searches from localStorage
function loadRecentSearches(): string[] {
  try {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Error loading recent searches:", e);
    return [];
  }
}

// Save recent search to localStorage
function saveRecentSearch(keyword: string, recentSearches: string[]): string[] {
  try {
    // Only add if it doesn't exist already
    if (!recentSearches.includes(keyword)) {
      const updated = [keyword, ...recentSearches].slice(0, 5); // Keep only 5 recent searches
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    }
    return recentSearches;
  } catch (e) {
    console.error("Error saving recent search:", e);
    return recentSearches;
  }
}

// Async thunk to fetch search results
export const getSearchResults = createAsyncThunk<Product[], string>(
  "search/getSearchResults",
  async (keyword, { rejectWithValue, dispatch }) => {
    try {
      if (!keyword || keyword.trim().length <= 2) {
        return [];
      }

      // Save to recent searches
      if (keyword.trim().length > 2) {
        dispatch(addRecentSearch(keyword));
      }

      const response = await axios.get<{success: boolean; data: Product[]}>(
        `${API_URL}/shop/search/${encodeURIComponent(keyword.trim())}`
      );

      return response.data.data || [];
    } catch (error: any) {
      console.error('Search failed:', error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch search results");
    }
  }
);

const searchSlice = createSlice({
  name: "shopSearch",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
      state.error = null;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const keyword = action.payload.trim();
      if (keyword.length > 2) {
        state.recentSearches = saveRecentSearch(keyword, state.recentSearches);
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
      localStorage.removeItem('recentSearches');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSearchResults.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.searchResults = [];
        state.error = action.payload as string || "An error occurred";
      });
  },
});

export const { resetSearchResults, addRecentSearch, clearRecentSearches } = searchSlice.actions;
export default searchSlice.reducer;