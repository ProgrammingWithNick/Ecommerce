import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

// Define the Product interface for shared types
export interface Product {
  _id: string;
  title: string;
  description?: string;
  image: string;
  brand: string;
  category: string;
  price: number;
  salePrice: number;
  totalStock: number;
  averageReview?: number;
}

interface ShoppingProductTileProps {
  product: Product;
  handleGetProductDetails: () => void;  // Changed to match how it's called in SearchProducts
  handleAddtoCart: (productId: string, totalStock: number) => void;
}

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}: ShoppingProductTileProps) {
  // Set default values if properties are missing
  const image = product.image || ''; // Default to empty string if missing
  const salePrice = product.salePrice || 0; // Default to 0 if missing
  const totalStock = product.totalStock || 0; // Default to 0 if missing

  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock < 10;
  const isOnSale = salePrice > 0;

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={handleGetProductDetails} className="cursor-pointer">
        <div className="relative">
          <img
            src={image}
            alt={`Image of ${product.title}`}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />

          {/* Conditionally render the stock status badges */}
          {isOutOfStock ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : isLowStock ? (
            <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">
              Only {totalStock} left
            </Badge>
          ) : isOnSale ? (
            <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
              Sale
            </Badge>
          ) : null}
        </div>

        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product.title}</h2>

          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{categoryOptionsMap[product.category]}</span>
            <span>{brandOptionsMap[product.brand]}</span>
          </div>

          <div className="flex justify-between items-center">
            <span
              className={`text-lg font-semibold text-primary ${isOnSale ? "line-through" : ""}`}
            >
              ₹{product.price}
            </span>

            {isOnSale && salePrice > 0 && (
              <span className="text-lg font-semibold text-primary">
                ₹{salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter>
        <Button
          disabled={isOutOfStock}
          onClick={() => handleAddtoCart(product._id, totalStock)}
          className="w-full"
        >
          {isOutOfStock ? "Out Of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;