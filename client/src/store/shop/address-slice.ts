import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Shared Address interface
export interface Address {
    _id: string;
    address: string;
    city: string;
    phone: string;
    pincode: string;
    notes?: string;
    userId: string;
}

// Extended type for create/edit with userId
interface AddressWithUserId extends Omit<Address, "_id"> {
    userId: string;
}

interface EditAddressPayload {
    userId: string;
    addressId: string;
    formData: Omit<Address, "_id">;
}

interface DeleteAddressPayload {
    userId: string;
    addressId: string;
}

// Slice state
interface AddressState {
    isLoading: boolean;
    addressList: Address[];
}

// Initial state
const initialState: AddressState = {
    isLoading: false,
    addressList: [],
};

// Thunks
export const addNewAddress = createAsyncThunk(
    "address/addNewAddress",
    async (formData: AddressWithUserId) => {
        try {
            const response = await axios.post(
                `${API_URL}/shop/address/add/${formData.userId}`,
                formData
            );
            return response.data;
        } catch (error) {
            console.error("Error adding address:", error);
            throw error;
        }
    }
);

export const fetchAllAddresses = createAsyncThunk(
    "address/fetchAllAddresses",
    async (userId: string) => {
        try {
            const response = await axios.get(
                `${API_URL}/shop/address/get/${userId}`
            );
            
            // Handle possible response formats
            let addresses = response.data;
            
            // If the API returns a success/data structure
            if (addresses && addresses.success && Array.isArray(addresses.data)) {
                addresses = addresses.data;
            }
            
            // Ensure we always return an array of valid addresses
            if (Array.isArray(addresses)) {
                return addresses.filter(addr => addr && addr._id);
            }
            
            return [];
        } catch (error) {
            console.error("Error fetching addresses:", error);
            return [];
        }
    }
);

export const editAddress = createAsyncThunk(
    "address/editAddress",
    async ({ userId, addressId, formData }: EditAddressPayload) => {
        try {
            const response = await axios.put(
                `${API_URL}/shop/address/update/${userId}/${addressId}`,
                formData
            );
            return response.data;
        } catch (error) {
            console.error("Error updating address:", error);
            throw error;
        }
    }
);

export const deleteAddress = createAsyncThunk(
    "address/deleteAddress",
    async ({ userId, addressId }: DeleteAddressPayload) => {
        try {
            const response = await axios.delete(
                `${API_URL}/shop/address/delete/${userId}/${addressId}`
            );
            
            // Return the ID of the deleted address
            return { _id: addressId, response: response.data };
        } catch (error) {
            console.error("Error deleting address:", error);
            throw error;
        }
    }
);

// Slice
const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        setAddressList: (state, action: PayloadAction<Address[]>) => {
            // Filter out any addresses without an _id
            state.addressList = action.payload.filter(addr => addr && addr._id);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addNewAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addNewAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                
                // Try to extract the address from the response
                const response = action.payload;
                let address: any = null;
                
                if (response && response.success && response.data) {
                    address = response.data;
                } else if (response && response._id) {
                    address = response;
                }
                
                // Only add the address if it has an _id
                if (address && address._id) {
                    state.addressList.push(address);
                }
            })
            .addCase(addNewAddress.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchAllAddresses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllAddresses.fulfilled, (state, action) => {
                state.isLoading = false;
                
                // Filter out any addresses without an _id
                if (Array.isArray(action.payload)) {
                    state.addressList = action.payload.filter(addr => addr && addr._id);
                }
            })
            .addCase(fetchAllAddresses.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(editAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(editAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                
                // Try to extract the address from the response
                const response = action.payload;
                let updatedAddress: any = null;
                
                if (response && response.success && response.data) {
                    updatedAddress = response.data;
                } else if (response && response._id) {
                    updatedAddress = response;
                }
                
                // Only update if the address has an _id
                if (updatedAddress && updatedAddress._id) {
                    const index = state.addressList.findIndex(
                        (address) => address._id === updatedAddress._id
                    );
                    
                    if (index !== -1) {
                        state.addressList[index] = updatedAddress;
                    }
                }
            })
            .addCase(editAddress.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(deleteAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                
                // Check if action.payload contains the addressId we expect
                if (action.payload && action.payload._id) {
                    // Only filter out the address with the matching _id
                    state.addressList = state.addressList.filter(
                        (address) => address._id !== action.payload._id
                    );
                } else {
                    console.error('Error: Address ID is missing in delete action payload');
                }
            })
            
            .addCase(deleteAddress.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setAddressList } = addressSlice.actions;
export default addressSlice.reducer;