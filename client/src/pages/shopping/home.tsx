import { Button } from "@/components/ui/button";
import {
    Airplay,
    BabyIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CloudLightning,
    Heater,
    Images,
    Shirt,
    ShirtIcon,
    ShoppingBasket,
    UmbrellaIcon,
    WashingMachine,
    WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ShoppingProductTile from "@/components/shopping/product-tile";
import ProductDetailsDialog from "@/components/shopping/product-details";

import { fetchAllProducts } from "@/store/admin/admin-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getFeatureImages } from "@/store/common-slice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import type { Product } from "@/components/shopping/product-tile";

interface ItemWithIcon {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

const categoriesWithIcon: ItemWithIcon[] = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon: ItemWithIcon[] = [
    { id: "nike", label: "Nike", icon: Shirt },
    { id: "adidas", label: "Adidas", icon: WashingMachine },
    { id: "puma", label: "Puma", icon: ShoppingBasket },
    { id: "levi", label: "Levi's", icon: Airplay },
    { id: "zara", label: "Zara", icon: Images },
    { id: "hm", label: "H&M", icon: Heater }, // changed "h&m" to "hm" to avoid '&' issues
];

function ShoppingHome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { productList } = useSelector((state: RootState) => state.adminProducts);
    const { featureImageList } = useSelector((state: RootState) => state.commonFeature);
    const { user } = useSelector((state: RootState) => state.auth);

    const handleNavigateToListingPage = useCallback((item: ItemWithIcon, section: string) => {
        sessionStorage.removeItem("filters");
        const filter = {
            [section]: [item.id],
        };
        sessionStorage.setItem("filters", JSON.stringify(filter));
        navigate(`/shop/listing`);
    }, [navigate]);

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setOpenDetailsDialog(true);
    };

    const handleAddToCart = (productId: string) => {
        if (!user?.id) {
            toast.error("Please login to add items to cart");
            return;
        }

        dispatch(addToCart({ userId: user.id, productId, quantity: 1 }))
            .unwrap()
            .then(() => {
                dispatch(fetchCartItems(user.id));
                toast.success("Product added to cart");
            })
            .catch(() => {
                toast.error("Failed to add product to cart");
            });
    };

    const handlePrevSlide = () => {
        if (featureImageList.length > 0) {
            setCurrentSlide((prev) => (prev - 1 + featureImageList.length) % featureImageList.length);
        }
    };

    const handleNextSlide = () => {
        if (featureImageList.length > 0) {
            setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            if (featureImageList?.length) {
                setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
            }
        }, 2000);
        return () => clearInterval(timer);
    }, [featureImageList]);

    useEffect(() => {
        dispatch(fetchAllProducts());
        dispatch(getFeatureImages());
    }, [dispatch]);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Banner */}
            <div className="relative w-full h-[600px] overflow-hidden">
                {featureImageList?.map((slide, index) => (
                    <img
                        key={index}
                        src={slide.image}
                        alt={slide.altText || `Banner ${index + 1}`}
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
                    />
                ))}

                <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevSlide}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextSlide}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
                >
                    <ChevronRightIcon className="w-4 h-4" />
                </Button>
            </div>

            {/* Categories */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categoriesWithIcon.map((category) => {
                            const Icon = category.icon;
                            return (
                                <Card
                                    key={category.id}
                                    onClick={() => handleNavigateToListingPage(category, "category")}
                                    className="cursor-pointer hover:shadow-lg transition-shadow"
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-6">
                                        <Icon className="w-12 h-12 mb-4 text-primary" />
                                        <span className="font-bold">{category.label}</span>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Brands */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {brandsWithIcon.map((brand) => {
                            const Icon = brand.icon;
                            return (
                                <Card
                                    key={brand.id}
                                    onClick={() => handleNavigateToListingPage(brand, "brand")}
                                    className="cursor-pointer hover:shadow-lg transition-shadow"
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-6">
                                        <Icon className="w-12 h-12 mb-4 text-primary" />
                                        <span className="font-bold">{brand.label}</span>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {productList?.map((product) => (
                            <ShoppingProductTile
                                key={product._id}
                                product={{ ...product, _id: product._id || "" }}
                                handleGetProductDetails={() => handleProductClick({ ...product, _id: product._id || "" })}
                                handleAddtoCart={handleAddToCart}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Detail Dialog */}
            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={
                    selectedProduct
                        ? { ...selectedProduct, description: selectedProduct.description || "" }
                        : null
                }
                onClose={() => {
                    setOpenDetailsDialog(false);
                    setSelectedProduct(null);
                }}
            />
        </div>
    );
}

export default ShoppingHome;
