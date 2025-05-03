import ProductImageUpload from "@/components/admin/image-upload";
import AdminProductTile from "@/components/admin/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { addProductFormElements } from "@/config";
import {
    addNewProduct,
    deleteProduct,
    editProduct,
    fetchAllProducts,
} from "@/store/admin/admin-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

const initialFormData = {
    image: "",
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
    averageReview: 0,
};

function AdminProducts() {
    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
    const [formData, setFormData] = useState<typeof initialFormData>(initialFormData);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState<string | null>(null);
    const [formValid, setFormValid] = useState(false);

    const { productList } = useSelector((state: RootState) => state.adminProducts);
    const dispatch = useDispatch<AppDispatch>();

    // Form Validation Logic
    useEffect(() => {
        // Improved field validation logic
        const requiredFields = ["title", "description", "category", "brand", "price", "salePrice", "totalStock"];

        // Check if all required fields have values
        const isRequiredFieldsValid = requiredFields.every(
            (key) => formData[key as keyof typeof formData] !== "" &&
                formData[key as keyof typeof formData] !== undefined &&
                formData[key as keyof typeof formData] !== null
        );

        // Image validation logic - different for new products vs edits
        const isImageValid =
            // For new products (no current edited ID), either uploaded image or existing image is required
            (currentEditedId === null)
                ? (uploadedImageUrl !== "" || formData.image !== "")
                // For editing existing products, if no new image is uploaded, assume the existing one is kept
                : true;

        // Check if form is valid - all required fields + image validation
        const isFieldsValid = isRequiredFieldsValid;
        const isValid = isFieldsValid && isImageValid;

        setFormValid(isValid); // Update form validity state
    }, [formData, uploadedImageUrl, currentEditedId]);




    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const payload = {
            ...formData,
            image: uploadedImageUrl || formData.image,  // Use uploaded image URL if available
            price: parseFloat(formData.price),
            salePrice: parseFloat(formData.salePrice),
            totalStock: parseInt(formData.totalStock, 10),
            averageReview: formData.averageReview,
        };

        if (!payload.image) {
            toast.error("Please upload a product image");
            return;
        }

        if (currentEditedId !== null) {
            dispatch(editProduct({ id: currentEditedId, formData: payload })).then((data: any) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    toast.success("Product updated successfully");
                    resetForm();
                }
            });
        } else {
            dispatch(addNewProduct(payload)).then((data: any) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    toast.success("Product added successfully");
                    resetForm();
                }
            });
        }
    }

    function resetForm() {
        setFormData(initialFormData);
        setOpenCreateProductsDialog(false);
        setCurrentEditedId(null);
        setImageFile(null);
        setUploadedImageUrl("");
    }

    function handleDelete(productId: string) {
        dispatch(deleteProduct(productId)).then((data: any) => {
            if (data?.payload?.success) {
                dispatch(fetchAllProducts());
                toast.success("Product deleted successfully");
            }
        });
    }

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    return (
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={() => setOpenCreateProductsDialog(true)}>Add New Product</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {productList?.length > 0 &&
                    productList.map((productItem: any) => (
                        <AdminProductTile
                            key={productItem._id}
                            setFormData={setFormData}
                            setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                            setCurrentEditedId={setCurrentEditedId}
                            product={productItem}
                            handleDelete={handleDelete}
                        />
                    ))}
            </div>

            <Sheet open={openCreateProductsDialog} onOpenChange={(open) => !open && resetForm()}>
                <SheetContent side="right" className="overflow-auto">
                    <SheetHeader>
                        <SheetTitle>
                            {currentEditedId !== null ? "Edit Product" : "Add New Product"}
                        </SheetTitle>
                        <SheetDescription>
                            {currentEditedId !== null
                                ? "Edit the fields below to update the product."
                                : "Fill the fields below to add a new product."}
                        </SheetDescription>
                    </SheetHeader>

                    <ProductImageUpload
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        uploadedImageUrl={uploadedImageUrl}
                        setUploadedImageUrl={setUploadedImageUrl}
                        setImageLoadingState={setImageLoadingState}
                        imageLoadingState={imageLoadingState}
                        isEditMode={currentEditedId !== null}
                    />

                    <div className="py-6">
                        <CommonForm
                            onSubmit={onSubmit}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={currentEditedId !== null ? "Edit" : "Add"}
                            formControls={addProductFormElements}
                            isBtnDisabled={!formValid || imageLoadingState}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </Fragment>
    );
}

export default AdminProducts;
