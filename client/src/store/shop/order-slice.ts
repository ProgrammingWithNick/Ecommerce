import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Define more comprehensive types
interface OrderItem {
    productId: string;
    title: string;
    image: string;
    price: number;
    quantity: number;
}

interface AddressInfo {
    addressId: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
    notes?: string;
}

interface Order {
    _id: string;
    userId: string;
    cartId: string;
    orderDate: string;
    orderUpdateDate: string;
    totalAmount: number;
    orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentMethod: "paypal" | "credit-card" | "cash-on-delivery";
    paymentStatus: "pending" | "completed" | "failed" | "refunded";
    cartItems: OrderItem[];
    addressInfo: AddressInfo;
    paymentId?: string;
    payerId?: string;
}

// Create Order DTO interface to match backend expectations
interface CreateOrderDTO {
    userId: string;
    cartId: string;
    cartItems: OrderItem[];
    addressInfo: AddressInfo;
    orderStatus: string;
    paymentMethod: string;
    paymentStatus: string;
    totalAmount: number;
    orderDate: string;
    orderUpdateDate: string;
    paymentId?: string;
    payerId?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    approvalURL?: string;
    orderId?: string;
}

interface ShoppingOrderState {
    approvalURL: string | null;
    isLoading: boolean;
    orderId: string | null;
    orderList: Order[];
    orderDetails: Order | null;
    error: string | null;
}

// Initial state
const initialState: ShoppingOrderState = {
    approvalURL: null,
    isLoading: false,
    orderId: null,
    orderList: [],
    orderDetails: null,
    error: null,
};

// Base API configuration
const API_BASE_URL = `${API_URL}/shop/order`;

// Async thunks for API calls
export const createNewOrder = createAsyncThunk(
    "order/createNewOrder",
    async (orderData: Omit<Order, "_id">, { rejectWithValue }) => {
        try {
            console.log("Creating order with data:", orderData);
            
            // Ensure date fields are set
            const fullOrderData: CreateOrderDTO = {
                ...orderData,
                orderDate: orderData.orderDate || new Date().toISOString(),
                orderUpdateDate: orderData.orderUpdateDate || new Date().toISOString(),
                // Set default values for optional fields if not provided
                paymentId: orderData.paymentId || "",
                payerId: orderData.payerId || "",
            };
            
            const response = await axios.post(
                `${API_BASE_URL}`,
                fullOrderData
            );
            
            console.log("Order API response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Order creation error:", error);
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

// Async thunks for API calls (unchanged)
export const capturePayment = createAsyncThunk(
    "order/capturePayment",
    async ({ paymentId, payerId, orderId }: { paymentId: string; payerId: string; orderId: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post<ApiResponse<Order>>(
                `${API_BASE_URL}/capture`,
                { paymentId, payerId, orderId }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            return rejectWithValue("Payment capture failed");
        }
    }
);

export const getAllOrdersByUserId = createAsyncThunk(
    "order/getAllOrdersByUserId",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get<ApiResponse<Order[]>>(
                `${API_BASE_URL}/user/${userId}`
            );
            
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            return rejectWithValue("Failed to fetch orders");
        }
    }
);

export const getOrderDetails = createAsyncThunk(
    "order/getOrderDetails",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get<ApiResponse<Order>>(
                `${API_BASE_URL}/${id}`
            );
            
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            return rejectWithValue("Failed to fetch order details");
        }
    }
);

// Create slice
const shoppingOrderSlice = createSlice({
    name: "shopOrder",
    initialState,
    reducers: {
        resetOrderDetails: (state) => {
            state.orderDetails = null;
            state.error = null;
        },
        clearOrderState: (state) => {
            state.approvalURL = null;
            state.orderId = null;
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        // Generic pending/error handlers
        const handlePending = (state: ShoppingOrderState) => {
            state.isLoading = true;
            state.error = null;
        };
        
        const handleRejected = (state: ShoppingOrderState, action: PayloadAction<unknown>) => {
            state.isLoading = false;
            state.error = action.payload as string || "An error occurred";
            console.error("Redux action rejected:", state.error);
        };

        builder
            // Create New Order
            .addCase(createNewOrder.pending, handlePending)
            .addCase(createNewOrder.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                console.log("Processing createNewOrder.fulfilled with payload:", action.payload);
                
                // Handle all possible response formats
                if (action.payload.success) {
                    // Direct properties in response (seen in your debug output)
                    if (action.payload.approvalURL) {
                        state.approvalURL = action.payload.approvalURL;
                        console.log("Setting approvalURL from direct property:", action.payload.approvalURL);
                    }
                    
                    if (action.payload.orderId) {
                        state.orderId = action.payload.orderId;
                        console.log("Setting orderId from direct property:", action.payload.orderId);
                        sessionStorage.setItem("currentOrderId", action.payload.orderId);
                    }
                    
                    // Nested data structure (original expected format)
                    if (action.payload.data) {
                        if (action.payload.data.approvalURL) {
                            state.approvalURL = action.payload.data.approvalURL;
                            console.log("Setting approvalURL from nested data:", action.payload.data.approvalURL);
                        }
                        
                        if (action.payload.data.orderId) {
                            state.orderId = action.payload.data.orderId;
                            console.log("Setting orderId from nested data:", action.payload.data.orderId);
                            sessionStorage.setItem("currentOrderId", action.payload.data.orderId);
                        }
                    }
                } else {
                    state.error = action.payload.message || "Failed to create order";
                    console.error("Order creation failed:", state.error);
                }
            })
            .addCase(createNewOrder.rejected, handleRejected)
            
            // Get All Orders
            .addCase(getAllOrdersByUserId.pending, handlePending)
            .addCase(getAllOrdersByUserId.fulfilled, (state, action: PayloadAction<ApiResponse<Order[]>>) => {
                state.isLoading = false;
                if (action.payload.success && action.payload.data) {
                    state.orderList = action.payload.data;
                } else {
                    state.error = action.payload.message || "No orders found";
                    state.orderList = [];
                }
            })
            .addCase(getAllOrdersByUserId.rejected, handleRejected)
            
            // Get Order Details
            .addCase(getOrderDetails.pending, handlePending)
            .addCase(getOrderDetails.fulfilled, (state, action: PayloadAction<ApiResponse<Order>>) => {
                state.isLoading = false;
                if (action.payload.success && action.payload.data) {
                    state.orderDetails = action.payload.data;
                } else {
                    state.error = action.payload.message || "Order details not found";
                    state.orderDetails = null;
                }
            })
            .addCase(getOrderDetails.rejected, handleRejected)
            
            // Capture Payment
            .addCase(capturePayment.pending, handlePending)
            .addCase(capturePayment.fulfilled, (state, action: PayloadAction<ApiResponse<Order>>) => {
                state.isLoading = false;
                if (action.payload.success && action.payload.data) {
                    state.orderDetails = action.payload.data;
                    if (state.orderList.length > 0) {
                        const index = state.orderList.findIndex(o => o._id === action.payload.data?._id);
                        if (index !== -1) {
                            state.orderList[index] = action.payload.data;
                        }
                    }
                } else {
                    state.error = action.payload.message || "Payment capture failed";
                }
            })
            .addCase(capturePayment.rejected, handleRejected);
    },
});

// Action
export const { resetOrderDetails, clearOrderState } = shoppingOrderSlice.actions;

// Reducer
export default shoppingOrderSlice.reducer;