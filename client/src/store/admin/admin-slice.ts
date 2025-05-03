import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// --------------------
// Types
// --------------------
export interface Product {
    _id?: string;
    title: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    salePrice: number;
    totalStock: number;
    averageReview: number;
    image: string;
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
    error: null,
};

// --------------------
// Async Thunks
// --------------------
export const addNewProduct = createAsyncThunk<
    Product,
    Product,
    { rejectValue: string }
>("products/add", async (formData, { rejectWithValue }) => {
    try {
        const { data }: AxiosResponse<Product> = await axios.post(
            `${API_URL}/admin/products/add`,
            formData,
            { headers: { "Content-Type": "application/json" } }
        );
        return data;
    } catch {
        return rejectWithValue("Failed to add product");
    }
});

export const fetchAllProducts = createAsyncThunk<
    Product[],
    void,
    { rejectValue: string }
>("products/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const { data }: AxiosResponse<Product[] | { data: Product[] }> = await axios.get(
            `${API_URL}/admin/products`
        );
        return Array.isArray(data) ? data : data.data;
    } catch {
        return rejectWithValue("Failed to fetch products");
    }
});

export const editProduct = createAsyncThunk<
    Product,
    { id: string; formData: Product },
    { rejectValue: string }
>("products/edit", async ({ id, formData }, { rejectWithValue }) => {
    try {
        const { data }: AxiosResponse<Product> = await axios.put(
            `${API_URL}/admin/products/edit/${id}`,
            formData,
            { headers: { "Content-Type": "application/json" } }
        );
        return data;
    } catch {
        return rejectWithValue("Failed to edit product");
    }
});

export const deleteProduct = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("products/delete", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/admin/products/delete/${id}`);
        return id;
    } catch {
        return rejectWithValue("Failed to delete product");
    }
});

// --------------------
// Slice
// --------------------
const AdminProductsSlice = createSlice({
    name: "adminProducts",
    initialState,
    reducers: {
        clearProductDetails: (state) => {
            state.productDetails = null;
        },
        clearErrors: (state) => {
            state.error = null;
        },
        setProductDetails: (state, action: PayloadAction<Product | null>) => {
            state.productDetails = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList = action.payload;
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || null;
            })

            .addCase(addNewProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addNewProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList.push(action.payload);
            })
            .addCase(addNewProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || null;
            })

            .addCase(editProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.productList.findIndex(
                    (product) => product._id === action.payload._id
                );
                if (index !== -1) {
                    state.productList[index] = action.payload;
                }
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || null;
            })

            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList = state.productList.filter(
                    (product) => product._id !== action.payload
                );
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || null;
            });
    },
});

export const { clearProductDetails, clearErrors, setProductDetails } =
    AdminProductsSlice.actions;

export default AdminProductsSlice.reducer;
