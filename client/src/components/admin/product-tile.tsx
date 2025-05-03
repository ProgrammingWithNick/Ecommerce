import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

type Product = {
    _id: string;
    title: string;
    price: number;
    salePrice: number;
    image: string;
    description?: string;
    category?: string;
    brand?: string;
    totalStock?: number;
    averageReview?: number;
};

type AdminProductTileProps = {
    product: Product;
    setFormData: React.Dispatch<React.SetStateAction<{
        image: string;
        title: string;
        description: string;
        category: string;
        brand: string;
        price: string;
        salePrice: string;
        totalStock: string;
        averageReview: number;
    }>>;
    setOpenCreateProductsDialog: (open: boolean) => void;
    setCurrentEditedId: (id: string) => void;
    handleDelete: (id: string) => void;
};

function AdminProductTile({
    product,
    setFormData,
    setOpenCreateProductsDialog,
    setCurrentEditedId,
    handleDelete,
}: AdminProductTileProps) {
    const handleEdit = () => {
        setOpenCreateProductsDialog(true);
        setCurrentEditedId(product._id);
        setFormData({
            image: product.image || "", // Ensure image is correctly passed here
            title: product.title || "",
            description: product.description || "",
            category: product.category || "",
            brand: product.brand || "",
            price: String(product.price ?? ""),
            salePrice: String(product.salePrice ?? ""),
            totalStock: String(product.totalStock ?? ""),
            averageReview: product.averageReview ?? 0,
        });
    };
    

    return (
        <Card className="w-full max-w-sm mx-auto shadow-md border rounded-lg overflow-hidden">
            <img
                src={product.image || "https://via.placeholder.com/300x300?text=No+Image"}
                alt={product.title}
                onError={(e) => {
                    (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/300x300?text=No+Image";
                }}
                className="w-full h-[300px] object-cover"
            />

            <CardContent>
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <div className="flex justify-between items-center mt-2">
                    <span
                        className={`text-gray-800 ${product.salePrice > 0 ? "line-through" : ""}`}
                    >
                        ₹{product.price}
                    </span>
                    {product.salePrice > 0 && (
                        <span className="text-red-600 font-bold">₹{product.salePrice}</span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex justify-between px-4 py-2">
                <Button variant="default" onClick={handleEdit}>
                    Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(product._id)}>
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
}

export default AdminProductTile;
