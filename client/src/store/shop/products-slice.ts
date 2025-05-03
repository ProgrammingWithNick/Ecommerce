import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// --------------------
// Types
// --------------------
interface FilterParams {
    [key: string]: string[];
}

export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    salePrice: number;
    totalStock: number;
    category: string;
    brand: string;
    image: string;
    averageReview: number;
}

interface ProductState {
    isLoading: boolean;
    productList: Product[];
    productDetails: Product | null;
    error: string | null;
}

// --------------------
// Initial State
// --------------------
const initialState: ProductState = {
    isLoading: false,
    productList: [],
    productDetails: null,
    error: null
};

// --------------------
// Helper function to convert filters to URL params
// --------------------
const createQueryString = (filterParams: FilterParams, sortParams: string): string => {
    const params = new URLSearchParams();
    
    // Add sort parameter
    if (sortParams) {
        params.append('sortBy', sortParams);
    }
    
    // Add filter parameters
    if (filterParams && typeof filterParams === 'object') {
        Object.entries(filterParams).forEach(([key, values]) => {
            if (Array.isArray(values) && values.length > 0) {
                params.append(key, values.join(','));
            }
        });
    }
    
    return params.toString();
};

// --------------------
// Async Thunks
// --------------------
export const fetchAllFilteredProducts = createAsyncThunk<
    Product[],
    { filterParams: FilterParams; sortParams: string }
>("products/fetchAllFilteredProducts", async ({ filterParams, sortParams }) => {
    const queryString = createQueryString(filterParams, sortParams);
    const response = await axios.get(`${API_URL}/shop/products?${queryString}`);
    
    if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch products");
    }
    
    return response.data.data;
});

export const fetchProductDetails = createAsyncThunk<Product, string>(
    "products/fetchProductDetails",
    async (id) => {
        const response = await axios.get(`${API_URL}/shop/products/${id}`);
        
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch product details");
        }
        
        return response.data.data;
    }
);

// --------------------
// Slice
// --------------------
const shoppingProductSlice = createSlice({
    name: "shopProducts",
    initialState,
    reducers: {
        setProductDetails: (state, action: PayloadAction<Product | null>) => {
            state.productDetails = action.payload;
        },
        clearProductDetails: (state) => {
            state.productDetails = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Filtered Products
            .addCase(fetchAllFilteredProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList = action.payload;
                state.error = null;
            })
            .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.productList = [];
                state.error = action.error.message || "Failed to fetch products";
            })

            // Product Details
            .addCase(fetchProductDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productDetails = action.payload;
                state.error = null;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.productDetails = null;
                state.error = action.error.message || "Failed to fetch product details";
            });
    },
});

// --------------------
// Exports
// --------------------
export const { setProductDetails, clearProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;