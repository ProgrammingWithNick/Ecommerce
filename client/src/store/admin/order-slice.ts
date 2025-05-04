// src/store/admin/order-slice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// --- Types ---
interface CartItem {
    _id: string;
    title: string;
    quantity: number;
    price: number;
}

interface AddressInfo {
    address: string;
    city: string;
    pincode: string;
    phone: string;
    notes?: string;
}

export interface Order {
    _id: string;
    orderDate: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    cartItems: CartItem[];
    addressInfo: AddressInfo;
}

interface AdminOrderState {
    orderList: Order[];
    orderDetails: Order | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AdminOrderState = {
    orderList: [],
    orderDetails: null,
    isLoading: false,
    error: null,
};

// --- Thunks ---
export const getAllOrdersForAdmin = createAsyncThunk<
    { success: boolean; data: Order[]; message: string },
    void,
    { rejectValue: { message: string } }
>("/order/getAllOrdersForAdmin", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/admin/order`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue({
                message: error.response?.data?.message || "Failed to fetch orders",
            });
        }
        return rejectWithValue({ message: "Failed to fetch orders" });
    }
});

export const getOrderDetailsForAdmin = createAsyncThunk<
    { success: boolean; data: Order; message: string },
    string,
    { rejectValue: { message: string } }
>("/order/getOrderDetailsForAdmin", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/admin/order/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue({
                message: error.response?.data?.message || "Failed to fetch order details",
            });
        }
        return rejectWithValue({ message: "Failed to fetch order details" });
    }
});

export const updateOrderStatus = createAsyncThunk<
    { success: boolean; message: string },
    { id: string; orderStatus: string },
    { rejectValue: { message: string } }
>("/order/updateOrderStatus", async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
        const response = await axios.put(
            `${API_URL}/admin/order/${id}`,
            { orderStatus },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error response details:", error.response?.data);
            
            // Extract the specific validation error message
            const errorMessages = error.response?.data?.message;
            if (Array.isArray(errorMessages) && errorMessages.length > 0) {
                console.error("Validation error:", errorMessages[0]);
            }
            
            return rejectWithValue({
                message: Array.isArray(error.response?.data?.message) 
                    ? error.response?.data?.message[0] 
                    : error.response?.data?.message || "Failed to update order status"
            });
        }
        console.error("Unknown error:", error);
        return rejectWithValue({ message: "Failed to update order status" });
    }
});

// --- Slice ---
const adminOrderSlice = createSlice({
    name: "adminOrderSlice",
    initialState,
    reducers: {
        resetOrderDetails: (state) => {
            state.orderDetails = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Orders
            .addCase(getAllOrdersForAdmin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.data;
                state.error = null;
            })
            .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.orderList = [];
                state.error = action.payload?.message || "Failed to fetch orders";
            })

            // Get Order Details
            .addCase(getOrderDetailsForAdmin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data;
                state.error = null;
            })
            .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.orderDetails = null;
                state.error = action.payload?.message || "Failed to fetch order details";
            })

            // Update Order Status
            .addCase(updateOrderStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to update order status";
            });
    },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;