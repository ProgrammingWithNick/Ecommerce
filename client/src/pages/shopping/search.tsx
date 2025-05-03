import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { debounce } from 'lodash-es';

import ProductDetailsDialog from '@/components/shopping/product-details';
import ShoppingProductTile from '@/components/shopping/product-tile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { fetchProductDetails, setProductDetails } from '@/store/shop/products-slice';
import { getSearchResults, resetSearchResults } from '@/store/shop/search-slice';

import type { AppDispatch, RootState } from '@/store/store';
import type { Product } from "@/components/shopping/product-tile";

// Define interface for ProductDetails that matches what ProductDetailsDialog expects
// Making _id required to match the Product interface
interface ProductDetailsType {
    _id: string;  // Now required, not optional
    title: string;
    description: string;
    image: string;
    price: number;
    salePrice: number;
    totalStock: number;
}

function SearchProducts() {
    const [keyword, setKeyword] = useState('');
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, setSearchParams] = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Selectors
    const { searchResults, isLoading } = useSelector((state: RootState) => state.shopSearch);
    const { productDetails } = useSelector((state: RootState) => state.shopProducts);
    const { user } = useSelector((state: RootState) => state.auth);
    const { cartItems } = useSelector((state: RootState) => state.shopCart);

    // Load search parameter from URL on initial render
    useEffect(() => {
        const keywordParam = searchParams.get('keyword');
        if (keywordParam) {
            setKeyword(keywordParam);
            dispatch(getSearchResults(keywordParam));
        }
    }, [dispatch, searchParams]);

    // Debounced search function
    const debouncedSearch = useMemo(
        () =>
            debounce((query: string) => {
                if (query.trim().length > 2) {
                    setSearchParams({ keyword: query });
                    dispatch(getSearchResults(query));
                } else if (query.trim().length === 0) {
                    setSearchParams({});
                    dispatch(resetSearchResults());
                }
            }, 500),
        [dispatch, setSearchParams]
    );

    // Keyword search effect
    useEffect(() => {
        debouncedSearch(keyword);
        return () => {
            debouncedSearch.cancel();
        };
    }, [keyword, debouncedSearch]);

    // Open product details dialog when productDetails is available
    useEffect(() => {
        if (productDetails?._id) {
            setOpenDetailsDialog(true);
        }
    }, [productDetails]);

    // Handle add to cart
    const handleAddToCart = useCallback(async (productId: string, totalStock: number) => {
        if (!user?.id) {
            toast.error('Please login to add items to cart');
            return;
        }

        const existingItem = cartItems.find(item => item.productId === productId);

        if (existingItem && existingItem.quantity >= totalStock) {
            toast.error(`Maximum ${totalStock} items allowed`);
            return;
        }

        try {
            const actionResult = await dispatch(addToCart({ userId: user.id, productId, quantity: 1 }));

            if (addToCart.fulfilled.match(actionResult)) {
                await dispatch(fetchCartItems(user.id));
                toast.success('Added to cart');
            } else {
                toast.error('Failed to add to cart');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        }
    }, [cartItems, dispatch, user]);

    // Handle fetch and set product details
    const handleGetProductDetails = useCallback((product: Product) => {
        // Map and fix the product details here to match ProductDetailsType
        const fixedProductDetails: ProductDetailsType = {
            _id: product._id,  // Now matches required field
            title: product.title,
            description: product.description || '',
            image: product.image || '',
            price: product.price || 0,
            salePrice: product.salePrice || 0,
            totalStock: product.totalStock || 0,
        };

        dispatch(setProductDetails(fixedProductDetails));
    }, [dispatch]);

    // Clear search
    const handleClearSearch = () => {
        setKeyword('');
        dispatch(resetSearchResults());
        setSearchParams({});
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search Input */}
            <div className="flex justify-center mb-8">
                <div className="w-full max-w-2xl relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                            ref={inputRef}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Search products..."
                            aria-label="Search products"
                            className="py-6 text-lg pl-10 pr-10"
                        />
                        {keyword && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label="Clear search"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="mt-6">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <div key={idx} className="animate-pulse bg-muted rounded-lg h-80" />
                        ))}
                    </div>
                ) : searchResults.length === 0 && keyword.trim().length > 2 ? (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-muted-foreground">
                            No products found for "{keyword}"
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Try different keywords or check for typos
                        </p>
                    </div>
                ) : keyword.trim().length > 0 && keyword.trim().length <= 2 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            Please enter at least 3 characters to search
                        </p>
                    </div>
                ) : searchResults.length > 0 ? (
                    <>
                        <p className="text-muted-foreground mb-4">
                            Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{keyword}"
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {searchResults.map((product) => (
                                <ShoppingProductTile
                                    key={product._id}
                                    product={product as Product}
                                    handleAddtoCart={handleAddToCart}
                                    handleGetProductDetails={() => handleGetProductDetails(product as Product)}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-medium text-muted-foreground">
                            Enter keywords to search for products
                        </h2>
                    </div>
                )}
            </div>

            {/* Product Details Dialog */}
            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails as ProductDetailsType}
                onClose={() => setOpenDetailsDialog(false)}
            />
        </div>
    );
}

export default SearchProducts;