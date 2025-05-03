import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

type CartItem = {
    _id: string;
    productId: string;
    title: string;
    price: number;
    salePrice: number;
    quantity: number;
    image: string;
};

type UserCartWrapperProps = {
    cartItems: CartItem[];
    setOpenCartSheet: (open: boolean) => void;
};

function UserCartWrapper({ cartItems, setOpenCartSheet }: UserCartWrapperProps) {
    const navigate = useNavigate();

    // Ensure cartItems is always an array
    const validCartItems = Array.isArray(cartItems) ? cartItems : [];

    // Calculate total only if we have valid cart items
    const totalCartAmount = validCartItems.reduce(
        (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0 ? currentItem.salePrice : currentItem.price) *
            currentItem.quantity,
        0
    );

    return (
        <SheetContent className="sm:max-w-md">
            <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
            </SheetHeader>
            
            {validCartItems.length === 0 ? (
                <div className="mt-8 text-center">
                    <p>Your cart is empty</p>
                </div>
            ) : (
                <div className="mt-8 space-y-4">
                    {validCartItems.map((item, index) => (
                        <UserCartItemsContent 
                            key={`${item._id || item.productId}-${index}`} 
                            cartItem={item} 
                        />
                    ))}
                
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">₹{totalCartAmount.toFixed(2)}</span>
                        </div>
                    </div>
                
                    <Button
                        onClick={() => {
                            navigate("/shop/checkout");
                            setOpenCartSheet(false);
                        }}
                        className="w-full mt-6"
                        disabled={validCartItems.length === 0}
                    >
                        Checkout
                    </Button>
                </div>
            )}
        </SheetContent>
    );
}

export default UserCartWrapper;