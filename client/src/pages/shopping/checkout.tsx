import Address from "@/components/shopping/address";
import checkoutBanner from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { clearOrderState, createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";
import { RootState, AppDispatch } from "@/store/store";

// Define types inline
type AddressType = {
    _id: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
    notes?: string;
};

type CartItemType = {
    _id: string;
    productId: string;
    title: string;
    image: string;
    price: number;
    salePrice: number;
    quantity: number;
};

function ShoppingCheckout() {
    const { cartId, cartItems } = useSelector((state: RootState) => state.shopCart);
    const { user } = useSelector((state: RootState) => state.auth);
    const { approvalURL, isLoading, error } = useSelector((state: RootState) => state.shopOrder);

    const [currentSelectedAddress, setCurrentSelectedAddress] = useState<AddressType | null>(null);
    const [isPaymentStart, setIsPaymentStart] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    // Debug logging for approvalURL changes
    useEffect(() => {
        console.log("Current approvalURL state:", approvalURL);
        
        // If approvalURL is available, redirect to PayPal
        if (approvalURL) {
            console.log("Redirecting to PayPal:", approvalURL);
            window.location.href = approvalURL;
        }
    }, [approvalURL]);

    // Handle errors from Redux state
    useEffect(() => {
        if (error) {
            toast.error(error);
            setIsPaymentStart(false);
        }
    }, [error]);

    // Reset payment state when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearOrderState());
        };
    }, [dispatch]);

    const totalCartAmount =
        cartItems?.reduce(
            (sum, currentItem) =>
                sum +
                (currentItem.salePrice > 0 ? currentItem.salePrice : currentItem.price) *
                currentItem.quantity,
            0
        ) || 0;

    async function handleInitiatePaypalPayment() {
        console.log("Starting payment process...");
        
        if (!cartItems || cartItems.length === 0) {
            toast.error("Your cart is empty. Please add items to proceed");
            return;
        }

        if (!currentSelectedAddress) {
            toast.error("Please select one address to proceed.");
            return;
        }

        if (!user) {
            toast.error("Please login to proceed with checkout");
            return;
        }

        console.log("Creating order with data:", {
            userId: user.id,
            cartId,
            itemCount: cartItems.length,
            addressId: currentSelectedAddress._id,
            totalAmount: totalCartAmount
        });

        const orderData = {
            userId: user.id,
            cartId,
            cartItems: cartItems.map((item) => ({
                productId: item.productId,
                title: item.title,
                image: item.image,
                price: item.salePrice > 0 ? item.salePrice : item.price,
                quantity: item.quantity,
            })),
            addressInfo: {
                addressId: currentSelectedAddress._id,
                address: currentSelectedAddress.address,
                city: currentSelectedAddress.city,
                pincode: currentSelectedAddress.pincode,
                phone: currentSelectedAddress.phone,
                notes: currentSelectedAddress.notes || '',
            },
            orderStatus: "pending" as const,
            paymentMethod: "paypal" as const,
            paymentStatus: "pending" as const,
            totalAmount: totalCartAmount,
            orderDate: new Date().toISOString(),
            orderUpdateDate: new Date().toISOString(),
            paymentId: "",
            payerId: "",
        };

        setIsPaymentStart(true);

        try {
            const resultAction = await dispatch(createNewOrder(orderData));
            // @ts-ignore - using unwrap() to get the actual payload
            const result = resultAction.payload;
            
            console.log("Order creation result:", result);
            
            if (!result.success) {
                toast.error(result.message || "Failed to initiate payment");
                setIsPaymentStart(false);
            }
            // No need to handle success case here as the useEffect will handle the redirect
            
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("An error occurred during checkout");
            setIsPaymentStart(false);
        }
    }

    return (
        <div className="flex flex-col">
            <div className="relative h-[300px] w-full overflow-hidden">
                <img
                    src={checkoutBanner}
                    alt="Checkout banner"
                    className="h-full w-full object-cover object-center"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
                <Address
                    selectedId={currentSelectedAddress?._id}
                    setCurrentSelectedAddress={setCurrentSelectedAddress}
                />
                <div className="flex flex-col gap-4">
                    {cartItems?.map((item: CartItemType) => (
                        <UserCartItemsContent key={item.productId} cartItem={item} />
                    ))}
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">₹{totalCartAmount.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="mt-4 w-full">
                        <Button
                            onClick={handleInitiatePaypalPayment}
                            className="w-full"
                            disabled={isLoading || isPaymentStart}
                        >
                            {isLoading || isPaymentStart
                                ? "Processing Paypal Payment..."
                                : "Checkout with Paypal"}
                        </Button>
                    </div>
                    {/* Debug information section */}
                    {/* {process.env.NODE_ENV !== 'production' && (
                        <div className="mt-4 p-2 bg-gray-100 rounded text-sm text-gray-800">
                            <div><strong>Debug Info:</strong></div>
                            <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
                            <div>Payment Started: {isPaymentStart ? 'Yes' : 'No'}</div>
                            <div>ApprovalURL: {approvalURL || 'None'}</div>
                            <div>Error: {error || 'None'}</div>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
}

export default ShoppingCheckout;