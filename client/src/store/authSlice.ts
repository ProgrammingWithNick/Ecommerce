// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// ========== Types ==========
interface User {
    id: string;
    email: string;
    userName: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    message: string | null;
    isLoading: boolean;
    authChecked: boolean; // ✅ NEW
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    message: null,
    isLoading: false,
    authChecked: false, // ✅ NEW
};


// ========== Thunks ==========

// Register
export const registerUser = createAsyncThunk(
    'auth/register',
    async (
        userData: { userName: string; email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await axios.post(`${API_URL}/auth/register`, userData, {
                withCredentials: true,
            });
            return res.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed';
            return rejectWithValue(message);
        }
    }
);

// Login
export const loginUser = createAsyncThunk(
    'auth/login',
    async (
        userData: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, userData, {
                withCredentials: true,
            });

            // validate payload
            if (!res.data?.success || !res.data?.user) {
                return rejectWithValue('Invalid login response');
            }

            return res.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            return rejectWithValue(message);
        }
    }
);

// Logout
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

// Forgot Password
export const forgotPassword = createAsyncThunk<
    { success: boolean; message: string }, // return type on success
    string, // input type: email
    { rejectValue: string } // rejected value type
>(
    'auth/forgotPassword',
    async (email: string, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
            return res.data; // Assumes the response has a structure like { success, message }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error resetting password';
            return rejectWithValue(message);
        }
    }
);



// Check Auth
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/auth/check-auth`, {
                withCredentials: true,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            });
            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Authentication check failed'
            );
        }
    }
);


// ========== Slice ==========
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.loading = false;
                state.user = user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            });

        // Logout
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Forgot Password
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });


        // Check Auth
        builder
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.authChecked = true;
                state.isAuthenticated = true;
                state.user = action.payload.user;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.authChecked = true;
                state.isAuthenticated = false;
                state.user = null;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
