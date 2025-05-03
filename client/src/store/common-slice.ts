import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

// Define types for the state and feature image
interface FeatureImage {
    _id: string;
    image: string;
    altText?: string;
}

interface CommonState {
    isLoading: boolean;
    featureImageList: FeatureImage[];
    error: string | null;
    deleteLoading: boolean;
}

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Initial state with types
const initialState: CommonState = {
    isLoading: false,
    featureImageList: [],
    error: null,
    deleteLoading: false,
};

// Async thunks for API calls
export const getFeatureImages = createAsyncThunk<
    FeatureImage[],  // Expect an array of feature images as response
    void,
    { rejectValue: string }
>(
    "common/getFeatureImages",
    async (_, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<{ data: FeatureImage[] }> = await axios.get(
                `${API_URL}/admin/feature/all`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue("Failed to fetch feature images");
        }
    }
);

export const addFeatureImage = createAsyncThunk<
    FeatureImage,  // Return a single feature image object
    { image: string; altText?: string },
    { rejectValue: string }
>(
    "common/addFeatureImage",
    async (imageData, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<{ data: FeatureImage }> = await axios.post(
                `${API_URL}/admin/feature/add`,
                imageData
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue("Failed to add feature image");
        }
    }
);

export const deleteFeatureImage = createAsyncThunk<
    string,  // Return the deleted image ID
    string,  // Accept image ID as parameter
    { rejectValue: string }
>(
    "common/deleteFeatureImage",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/admin/feature/${id}`);
            return id; // Return the ID of the deleted image
        } catch (error) {
            return rejectWithValue("Failed to delete feature image");
        }
    }
);

// Create slice
const commonFeatureSlice = createSlice({
    name: "commonFeature",
    initialState,
    reducers: {
        clearFeatureImages: (state) => {
            state.featureImageList = [];
        },
        clearErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get feature images
            .addCase(getFeatureImages.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getFeatureImages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.featureImageList = action.payload;
            })
            .addCase(getFeatureImages.rejected, (state, action) => {
                state.isLoading = false;
                state.featureImageList = [];
                state.error = action.payload as string;
            })

            // Add feature image
            .addCase(addFeatureImage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addFeatureImage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.featureImageList.push(action.payload);
            })
            .addCase(addFeatureImage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            
            // Delete feature image
            .addCase(deleteFeatureImage.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteFeatureImage.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.featureImageList = state.featureImageList.filter(
                    (image) => image._id !== action.payload
                );
            })
            .addCase(deleteFeatureImage.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearFeatureImages, clearErrors } = commonFeatureSlice.actions;
export default commonFeatureSlice.reducer;