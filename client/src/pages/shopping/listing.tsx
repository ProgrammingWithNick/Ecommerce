import ProductFilter from "@/components/shopping/filter";
import ProductDetailsDialog from "@/components/shopping/product-details";
import ShoppingProductTile from "@/components/shopping/product-tile";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";

import {
    fetchProductDetails,
    fetchAllFilteredProducts,
    clearProductDetails
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import {
    useCallback,
    useEffect,
    useState,
    useMemo
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "@/store/store";

interface FilterParams {
    [key: string]: string[];
}

interface Product {
    _id: string;
    title: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    salePrice: number;
    totalStock: number;
    averageReview: number;
    image: string;
}

// Function to extract the user ID from the user object
const getUserId = (user: any): string | null => {
    if (!user) return null;
    if (user._id) return user._id;
    if (user.id) return user.id;
    if (user._doc && user._doc._id) return user._doc._id;
    return null;
};

function createSearchParamsHelper(filterParams: FilterParams): string {
    return Object.entries(filterParams)
        .filter(([_, value]) => Array.isArray(value) && value.length > 0)
        .map(([key, value]) => `${key}=${encodeURIComponent(value.join(","))}`)
        .join("&");
}

function ShoppingListing() {
    const dispatch = useDispatch<AppDispatch>();
    const { productList, productDetails, isLoading, error } = useSelector((state: RootState) => state.shopProducts);
    const { cartItems } = useSelector((state: RootState) => state.shopCart);
    const { user } = useSelector((state: RootState) => state.auth);

    const [filters, setFilters] = useState<FilterParams>({});
    const [sort, setSort] = useState<string>("price-lowtohigh");
    const [searchParams, setSearchParams] = useSearchParams();
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

    const categorySearchParam = searchParams.get("category");

    // Get user ID safely
    const userId = useMemo(() => getUserId(user), [user]);

    const filteredAndSortedProducts = useMemo(() => {
        if (!productList || !Array.isArray(productList)) return [];

        let result = [...productList];

        if (categorySearchParam) {
            result = result.filter(product =>
                product.category.toLowerCase() === categorySearchParam.toLowerCase()
            );
        }

        if (filters && typeof filters === 'object') {
            Object.entries(filters).forEach(([key, values]) => {
                if (Array.isArray(values) && values.length > 0) {
                    result = result.filter(product =>
                        values.includes(product[key as keyof Product]?.toString())
                    );
                }
            });
        }

        switch (sort) {
            case "price-lowtohigh":
                return result.sort((a, b) => a.price - b.price);
            case "price-hightolow":
                return result.sort((a, b) => b.price - a.price);
            case "newest":
                return result;
            case "rating-hightolow":
                return result.sort((a, b) => b.averageReview - a.averageReview);
            default:
                return result;
        }
    }, [productList, filters, sort, categorySearchParam]);

    const handleSort = useCallback((value: string) => {
        setSort(value);
    }, []);

    const handleFilter = useCallback((sectionId: string, optionId: string) => {
        setFilters((prevFilters) => {
            const updated = { ...prevFilters };
            const currentOptions = updated[sectionId] || [];
            const index = currentOptions.indexOf(optionId);

            if (index >= 0) {
                updated[sectionId] = currentOptions.filter((id) => id !== optionId);
            } else {
                updated[sectionId] = [...currentOptions, optionId];
            }

            sessionStorage.setItem("filters", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const handleGetProductDetails = useCallback((productId: string) => {
        dispatch(fetchProductDetails(productId))
            .unwrap()
            .then(() => {
                setOpenDetailsDialog(true);
            })
            .catch((err: any) => {
                toast.error("Failed to load product details", {
                    description: err.message || "Please try again later"
                });
            });
    }, [dispatch]);

    const handleAddToCart = useCallback(
        (productId: string, totalStock: number) => {
            if (!userId) {
                toast.error("Please login to add items to cart");
                return;
            }
    
            const items = cartItems || [];
            const existingItem = items.find(
                (item: { productId: string; quantity: number }) => item?.productId === productId
            );
            const quantity = existingItem?.quantity || 0;
    
            if (quantity + 1 > totalStock) {
                toast.error(`Only ${totalStock} in stock. You already added ${quantity}.`);
                return;
            }
    
            dispatch(addToCart({ userId, productId, quantity: 1 }))
                .unwrap()
                .then((res) => {
                    if (res?.success) {
                        dispatch(fetchCartItems(userId));
                        toast.success("Product added to cart");
                    } else {
                        toast.error(res?.message || "Failed to add product to cart");
                    }
                })
                .catch((error) => {
                    console.error("Add to cart error:", error);
                    const errorMsg = error?.message ||
                        (typeof error === 'string' ? error :
                            "Failed to add product to cart");
                    toast.error(errorMsg);
                });
        },
        [dispatch, cartItems, userId]
    );

    const handleCloseDetailsDialog = useCallback(() => {
        setOpenDetailsDialog(false);
        dispatch(clearProductDetails());
    }, [dispatch]);

    useEffect(() => {
        const savedFilters = sessionStorage.getItem("filters");
        if (savedFilters) {
            try {
                setFilters(JSON.parse(savedFilters));
            } catch {
                sessionStorage.removeItem("filters");
                setFilters({});
            }
        }
    }, [categorySearchParam]);

    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            const queryStr = createSearchParamsHelper(filters);
            setSearchParams(queryStr ? new URLSearchParams(queryStr) : {});
        }
    }, [filters, setSearchParams]);

    useEffect(() => {
        // Fetch products with proper filtering and sorting parameters
        dispatch(fetchAllFilteredProducts({
            filterParams: filters,
            sortParams: sort
        }));

        if (userId) {
            dispatch(fetchCartItems(userId));
        }
    }, [dispatch, userId, sort, filters]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
            <ProductFilter filters={filters} handleFilter={handleFilter} />
            <div className="bg-background w-full rounded-lg shadow-sm">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-extrabold">All Products</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">
                            {filteredAndSortedProducts.length} Products
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <ArrowUpDownIcon className="h-4 w-4" />
                                    <span>Sort by</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                    {sortOptions.map((sortItem) => (
                                        <DropdownMenuRadioItem
                                            key={sortItem.id}
                                            value={sortItem.id}
                                        >
                                            {sortItem.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {isLoading ? (
                        <div className="col-span-full text-center py-10">
                            Loading products...
                        </div>
                    ) : error ? (
                        <div className="col-span-full text-center text-destructive py-10">
                            {error}
                        </div>
                    ) : filteredAndSortedProducts.length > 0 ? (
                        filteredAndSortedProducts.map((productItem: Product) => (
                            <ShoppingProductTile
                                key={productItem._id}
                                product={productItem}
                                handleGetProductDetails={() => handleGetProductDetails(productItem._id)}
                                handleAddtoCart={handleAddToCart}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-muted-foreground py-10">
                            No products found.
                        </div>
                    )}
                </div>
            </div>

            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails}
                onClose={handleCloseDetailsDialog}
            />
        </div>
    );
}

export default ShoppingListing;