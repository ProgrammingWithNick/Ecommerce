import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

// Define CartItem type
type CartItem = {
    _id: string;
    productId: string;
    title: string;
    price: number;
    salePrice: number;
    quantity: number;
    image: string;
};

// Define the AddToCartResponse type
interface AddToCartResponse {
    success: boolean;
    message?: string;
    cartItem?: CartItem;
}

// Define CartResponse type
type CartResponse = {
    success: boolean;
    items: CartItem[];
    userId: string;
    _id: string;
};

// Define DeleteCartItemResponse type
type DeleteCartItemResponse = {
    success: boolean;
    deletedItemId: string;
};

// Define UpdateCartQuantityResponse type
type UpdateCartQuantityResponse = {
    success: boolean;
    updatedItem: CartItem;
};

// Define the CartState type
type CartState = {
    cartId: string;
    cartItems: CartItem[];
    isLoading: boolean;
    error: string | null;
};

const initialState: CartState = {
    cartId: "",
    cartItems: [],
    isLoading: false,
    error: null
};

// ─── Async Thunks ─────────────────────────────

// Add to Cart
// Add to Cart
export const addToCart = createAsyncThunk<
    AddToCartResponse,
    { userId: string; productId: string; quantity: number }
>("cart/addToCart", async ({ userId, productId, quantity }, thunkAPI) => {
    try {
        // Get current state to check for existing items
        const state = thunkAPI.getState() as { shopCart: CartState };
        const existingItem = state.shopCart.cartItems.find(item => item.productId === productId);

        // If item exists, we're updating quantity instead of adding new item
        const endpoint = existingItem
            ? `${API_URL}/shop/cart/update-cart`
            : `${API_URL}/shop/cart/add`;

        const method = existingItem ? 'put' : 'post';
        const finalQuantity = existingItem ? existingItem.quantity + quantity : quantity;

        const response = await axios({
            method,
            url: endpoint,
            data: {
                userId,
                productId,
                quantity: finalQuantity
            }
        });

        // If we updated an existing item, format response to match expected structure
        if (existingItem) {
            const updatedCart = response.data;
            const updatedItem = updatedCart.items?.find((item: any) => item.productId === productId);

            return {
                success: true,
                cartItem: updatedItem || {
                    _id: existingItem._id,
                    productId,
                    title: existingItem.title,
                    price: existingItem.price,
                    salePrice: existingItem.salePrice,
                    quantity: finalQuantity,
                    image: existingItem.image
                }
            };
        }

        return response.data;
    } catch (err: any) {
        console.error("Add to cart error:", err.response?.data || err.message);
        return thunkAPI.rejectWithValue({
            success: false,
            message: err.response?.data?.message || "Failed to add to cart",
        } as AddToCartResponse);
    }
});

// Fetch Cart Items
export const fetchCartItems = createAsyncThunk<CartResponse, string>(
    "cart/fetchCartItems",
    async (userId, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/shop/cart/get/${userId}`);

            // Return the whole response data including items array
            return response.data;
        } catch (err: any) {
            console.error("Error fetching cart:", err.response?.data || err.message);
            return thunkAPI.rejectWithValue({
                success: false,
                items: [],
                message: err.response?.data?.message || "Failed to fetch cart"
            });
        }
    }
);

// Delete Cart Item
export const deleteCartItem = createAsyncThunk<
    DeleteCartItemResponse,
    { userId: string; productId: string }
>("cart/deleteCartItem", async ({ userId, productId }, thunkAPI) => {
    try {
        await axios.delete(`${API_URL}/shop/cart/delete/${userId}/${productId}`);
        return { success: true, deletedItemId: productId };
    } catch (err: any) {
        console.error("Delete cart item error:", err.response?.data || err.message);
        return thunkAPI.rejectWithValue({
            success: false,
            deletedItemId: productId,
            message: err.response?.data?.message || "Failed to delete cart item"
        });
    }
});

// Update Cart Quantity
export const updateCartQuantity = createAsyncThunk<
    UpdateCartQuantityResponse,
    { userId: string; productId: string; quantity: number }
>("cart/updateCartQuantity", async ({ userId, productId, quantity }, thunkAPI) => {
    try {
        const response = await axios.put(`${API_URL}/shop/cart/update-cart`, {
            userId,
            productId,
            quantity,
        });

        const updatedCart = response.data;

        // Check if items exists before trying to find
        if (!updatedCart || !updatedCart.items || !Array.isArray(updatedCart.items)) {
            console.warn("Update cart response missing items array:", updatedCart);
            return {
                success: true,
                updatedItem: {
                    _id: productId,
                    productId: productId,
                    title: "",
                    price: 0,
                    salePrice: 0,
                    quantity,
                    image: "",
                },
            };
        }

        const updatedItem = updatedCart.items.find((item: any) => item.productId === productId);

        if (!updatedItem) {
            console.warn(`Item with productId ${productId} not found in updated cart`);
            return {
                success: true,
                updatedItem: {
                    _id: productId,
                    productId: productId,
                    title: "",
                    price: 0,
                    salePrice: 0,
                    quantity,
                    image: "",
                },
            };
        }

        return {
            success: true,
            updatedItem: {
                ...updatedItem,
                _id: updatedItem._id || productId,
            },
        };
    } catch (err: any) {
        console.error("Update cart quantity error:", err.response?.data || err.message);
        return thunkAPI.rejectWithValue({
            success: false,
            updatedItem: {
                _id: productId,
                productId: productId,
                title: "",
                price: 0,
                salePrice: 0,
                quantity,
                image: "",
            },
            message: err.response?.data?.message || "Failed to update cart quantity"
        });
    }
});


// ─── Slice ─────────────────────────────

const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add to Cart
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;

                if (!action.payload?.success) {
                    state.error = action.payload?.message || "Add to cart failed";
                    return;
                }

                // 🧼 Clean merge: always replace with server truth
                if (action.payload.cartItem) {
                    const existingIndex = state.cartItems.findIndex(
                        (item) => item.productId === action.payload.cartItem?.productId
                    );
                    if (existingIndex !== -1) {
                        state.cartItems[existingIndex] = action.payload.cartItem;
                    } else {
                        state.cartItems.push(action.payload.cartItem);
                    }
                }
            })



            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ? (action.payload as any).message : "Failed to add to cart";
                console.error("Failed to add to cart", action.payload);
            })

            // Fetch Cart Items
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;

                // Store the cart ID
                state.cartId = action.payload._id;

                // Check if items is an array before assigning
                if (action.payload.items && Array.isArray(action.payload.items)) {
                    state.cartItems = action.payload.items;
                } else {
                    console.warn("Fetch cart returned invalid items:", action.payload);
                    state.cartItems = [];
                    state.error = "Invalid cart data format";
                }

            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.isLoading = false;
                state.cartItems = [];
                state.error = action.payload ? (action.payload as any).message : "Failed to fetch cart";
                console.error("Failed to fetch cart", action.payload);
            })

            // Delete Cart Item
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.cartItems = state.cartItems.filter(
                    (item) => item.productId !== action.payload.deletedItemId
                );
            })
            .addCase(deleteCartItem.rejected, (state, action) => {
                state.error = action.payload ? (action.payload as any).message : "Failed to delete cart item";
            })

            // Update Cart Quantity
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                const updated = action.payload.updatedItem;
                const index = state.cartItems.findIndex((item) => item.productId === updated.productId);
                if (index !== -1) {
                    state.cartItems[index].quantity = updated.quantity;
                }
            })
            .addCase(updateCartQuantity.rejected, (state, action) => {
                state.error = action.payload ? (action.payload as any).message : "Failed to update cart quantity";
            });
    },
});

// ─── Exports ─────────────────────────────

export default shoppingCartSlice.reducer;