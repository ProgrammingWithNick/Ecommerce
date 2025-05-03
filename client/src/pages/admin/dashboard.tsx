import ProductImageUpload from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { Trash2Icon, ImageIcon } from "lucide-react";

// Define the feature image item type
interface FeatureImageItem {
    _id: string;
    image: string;
    altText?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// Define the state type
interface CommonFeatureState {
    featureImageList: FeatureImageItem[];
    isLoading: boolean;
    deleteLoading: boolean;
    error: string | null;
}

function AdminDashboard() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
    const [imageLoadingState, setImageLoadingState] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const [validatingImages, setValidatingImages] = useState<boolean>(false);
    const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

    const isMounted = useRef(true);
    const dispatch = useDispatch<AppDispatch>();
    const { featureImageList, isLoading, deleteLoading } = useSelector((state: any) =>
        state.commonFeature as CommonFeatureState
    );

    function handleUploadFeatureImage() {
        if (!uploadedImageUrl) return;

        setImageLoadingState(true);
        dispatch(addFeatureImage({ image: uploadedImageUrl }))
            .unwrap()
            .then(() => {
                setUploadSuccess(true);
                setTimeout(() => setUploadSuccess(false), 3000);
                dispatch(getFeatureImages());
                setUploadedImageUrl("");
                setImageFile(null);
            })
            .catch((error) => {
                console.error("Error uploading feature image:", error);
            })
            .finally(() => {
                setImageLoadingState(false);
            });
    }

    function handleDeleteFeatureImage(id: string) {
        setDeleteError(null);
        dispatch(deleteFeatureImage(id))
            .unwrap()
            .then(() => {
                dispatch(getFeatureImages());
                if (failedImages[id]) {
                    setFailedImages((prev) => {
                        const newState = { ...prev };
                        delete newState[id];
                        return newState;
                    });
                }
            })
            .catch((error) => {
                console.error("Error deleting feature image:", error);
                setDeleteError("Failed to delete image. Please try again.");
                setTimeout(() => setDeleteError(null), 3000);
            });
    }

    function handleImageError(id: string) {
        console.log(`Image with ID ${id} failed to load`);
        setFailedImages((prev) => ({
            ...prev,
            [id]: true,
        }));
    }

    function checkImage(url: string): Promise<boolean> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    async function manuallyValidateImages() {
        if (!featureImageList?.length) return;
        setValidatingImages(true);
        const newFailedImages: Record<string, boolean> = {};

        for (const image of featureImageList) {
            const isValid = await checkImage(image.image);
            if (!isValid) {
                console.log(`Image validation failed for ID ${image._id}`);
                newFailedImages[image._id] = true;
            }
        }

        if (isMounted.current) {
            setFailedImages(newFailedImages);
            setValidatingImages(false);
        }
    }

    useEffect(() => {
        dispatch(getFeatureImages());
        return () => {
            isMounted.current = false;
        };
    }, [dispatch]);

    useEffect(() => {
        if (featureImageList?.length > 0) {
            manuallyValidateImages();
        }
    }, [featureImageList]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Feature Images Management</h1>

            {deleteError && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{deleteError}</AlertDescription>
                </Alert>
            )}

            {uploadSuccess && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                    <AlertDescription className="text-green-700">
                        Image uploaded successfully!
                    </AlertDescription>
                </Alert>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
                <ProductImageUpload
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    uploadedImageUrl={uploadedImageUrl}
                    setUploadedImageUrl={setUploadedImageUrl}
                    setImageLoadingState={setImageLoadingState}
                    imageLoadingState={imageLoadingState}
                    isCustomStyling={true}
                    isEditMode={false}
                />

                {uploadedImageUrl && (
                    <div className="mt-4 p-2 border rounded-md">
                        <p className="text-sm font-medium mb-2">Preview:</p>
                        <img
                            src={uploadedImageUrl}
                            alt="Upload preview"
                            className="h-40 object-contain mx-auto"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = "";
                                console.error("Failed to load image preview");
                            }}
                        />
                    </div>
                )}

                <Button
                    onClick={handleUploadFeatureImage}
                    className="mt-5 w-full"
                    disabled={!uploadedImageUrl || imageLoadingState || isLoading}
                >
                    {imageLoadingState || isLoading ? "Uploading..." : "Upload Feature Image"}
                </Button>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Current Feature Images</h2>

                {isLoading || validatingImages ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
                        ))}
                    </div>
                ) : featureImageList?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featureImageList.map((featureImgItem) => (
                            <div key={featureImgItem._id} className="relative border rounded-lg overflow-hidden">
                                {failedImages[featureImgItem._id] ? (
                                    <div className="flex flex-col items-center justify-center h-[300px] bg-gray-100 relative">
                                        <ImageIcon className="h-16 w-16 text-gray-400" />
                                        <p className="text-gray-500 mt-2">Image not available</p>
                                        <p className="text-xs text-gray-400 mt-1 px-4 truncate max-w-full">
                                            {featureImgItem.image}
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2"
                                            onClick={async () => {
                                                const isValid = await checkImage(featureImgItem.image);
                                                if (isValid && isMounted.current) {
                                                    setFailedImages((prev) => {
                                                        const newState = { ...prev };
                                                        delete newState[featureImgItem._id];
                                                        return newState;
                                                    });
                                                }
                                            }}
                                        >
                                            Retry
                                        </Button>
                                        <button
                                            onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                                            disabled={deleteLoading}
                                            className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-red-100 text-red-600 p-1 rounded-full shadow transition-all"
                                        >
                                            <Trash2Icon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <img
                                            src={featureImgItem.image}
                                            alt={featureImgItem.altText || "Feature image"}
                                            className="w-full h-[300px] object-cover"
                                            crossOrigin="anonymous"
                                            onError={() => handleImageError(featureImgItem._id)}
                                        />
                                        <button
                                            onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                                            disabled={deleteLoading}
                                            className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-red-100 text-red-600 p-1 rounded-full shadow transition-all"
                                        >
                                            <Trash2Icon className="h-5 w-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No feature images uploaded yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
