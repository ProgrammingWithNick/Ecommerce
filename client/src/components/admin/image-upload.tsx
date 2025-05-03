import { FileIcon, UploadCloudIcon, XIcon, CheckCircleIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

type ProductImageUploadProps = {
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
    imageLoadingState: boolean;
    uploadedImageUrl: string;
    setUploadedImageUrl: (url: string) => void;
    setImageLoadingState: (state: boolean) => void;
    isEditMode: boolean;
    isCustomStyling?: boolean;
    setFormData?: (data: any) => void;
};

function ProductImageUpload({
    imageFile,
    setImageFile,
    imageLoadingState,
    uploadedImageUrl,
    setUploadedImageUrl,
    setImageLoadingState,
    isEditMode,
    isCustomStyling = false,
    setFormData,
}: ProductImageUploadProps) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    function handleImageFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setImageFile(selectedFile);
            setUploadError(""); // Clear any previous errors
        }
    }

    function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
    }

    function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) {
            setImageFile(droppedFile);
            setUploadError(""); // Clear any previous errors
        }
    }

    function handleRemoveImage() {
        setImageFile(null);
        setUploadedImageUrl(""); // Make sure to clear the URL
        setUploadError(""); // Clear any errors
        setUploadProgress(0);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    async function uploadImageToCloudinary() {
        if (!imageFile) return; // Ensure there is a file before proceeding

        try {
            setImageLoadingState(true);
            setUploadProgress(10); // Start progress
            setUploadError(""); // Clear any previous errors
            
            const data = new FormData();
            data.append("my_file", imageFile as Blob);

            const response = await axios.post(
                `${API_URL}/admin/products/upload-image`,
                data,
                {
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setUploadProgress(percentCompleted);
                        }
                    }
                }
            );

            if (response?.data?.success) {
                const url = response.data.result; // Assuming the response data structure is correct
                console.log("Image uploaded successfully:", url);
                setUploadedImageUrl(url); // Set the URL to the state
                
                if (setFormData) {
                    setFormData((prev: any) => ({ ...prev, image: url })); // Update formData with image URL
                }
                
                setUploadProgress(100); // Complete progress
            } else {
                console.error("Image upload failed", response?.data);
                setUploadError("Upload failed: " + (response?.data?.message || "Unknown error"));
                setUploadProgress(0);
            }
        } catch (error: any) {
            console.error("Upload error:", error);
            setUploadError("Upload error: " + (error.message || "Unknown error"));
            setUploadProgress(0);
        } finally {
            setImageLoadingState(false);
        }
    }

    useEffect(() => {
        if (imageFile !== null) uploadImageToCloudinary();
    }, [imageFile]);

    return (
        <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
            <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
            
            {uploadError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {uploadError}
                </div>
            )}
            
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`${isEditMode ? "opacity-60" : ""} border-2 border-dashed rounded-lg p-4 ${
                    uploadedImageUrl ? "border-green-400" : "border-gray-300"
                }`}
            >
                <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    ref={inputRef}
                    onChange={handleImageFileChange}
                    disabled={isEditMode}
                    accept="image/*" // Accept only image files
                />
                
                {!imageFile ? (
                    <Label
                        htmlFor="image-upload"
                        className={`${
                            isEditMode ? "cursor-not-allowed" : "cursor-pointer"
                        } flex flex-col items-center justify-center h-32`}
                    >
                        <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                        <span className="text-center">Drag & drop or click to upload image</span>
                        <span className="text-xs text-gray-500 mt-1">Supports: JPG, PNG, GIF, etc.</span>
                    </Label>
                ) : imageLoadingState ? (
                    <div className="py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                            <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-center">Uploading... {uploadProgress}%</p>
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center flex-1 min-w-0">
                            <FileIcon className="w-8 text-primary mr-2 h-8 flex-shrink-0" />
                            <p className="text-sm font-medium truncate">{imageFile.name}</p>
                        </div>
                        
                        {uploadedImageUrl && (
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        )}
                        
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground flex-shrink-0"
                            onClick={handleRemoveImage}
                        >
                            <XIcon className="w-4 h-4" />
                            <span className="sr-only">Remove File</span>
                        </Button>
                    </div>
                )}
            </div>
            
            {uploadedImageUrl && (
                <div className="mt-2 text-xs text-green-600 flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-1" /> Image uploaded successfully
                </div>
            )}
        </div>
    );
}

export default ProductImageUpload;