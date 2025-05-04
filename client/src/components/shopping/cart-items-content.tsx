import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { AppDispatch } from "@/store/store";

type CartItem = {
    _id: string;          // This is the cart item ID
    productId: string;
    title: string;
    price: number;
    salePrice: number;
    quantity: number;
    image: string;
};

type Props = {
    cartItem: CartItem;
};

function UserCartItemsContent({ cartItem }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { productList = [] } = useSelector((state: RootState) => state.adminProducts);

    function handleUpdateQuantity(item: CartItem, typeOfAction: "plus" | "minus") {
        if (typeOfAction === "plus") {
            const product = productList.find((p) => p._id === item.productId);
            const stock = product?.totalStock ?? 0;

            if (item.quantity + 1 > stock) {
                toast.error(`Only ${stock} item(s) available in stock`);
                return;
            }
        }

        dispatch(
            updateCartQuantity({
                userId: user?.id || "",
                productId: item.productId,
                quantity: typeOfAction === "plus" ? item.quantity + 1 : item.quantity - 1,
            })
        ).unwrap().then((data: { success: boolean }) => {
            if (data.success) {
                toast.success("Cart updated");
            }
        }).catch(() => {
            toast.error("Failed to update cart");
        });
    }

    function handleCartItemDelete(item: CartItem) {
        dispatch(deleteCartItem({ userId: user?.id || "", productId: item.productId }))
            .unwrap()
            .then((data: { success: boolean }) => {
                if (data.success) {
                    toast.success("Item removed from cart");
                }
            })
            .catch(() => {
                toast.error("Failed to remove item from cart");
            });
    }

    // Make sure we have valid image URL
    const imageUrl = cartItem.image || "/api/placeholder/200/200";

    return (
        <div className="flex items-center space-x-4">
            <img src={imageUrl} alt={cartItem.title} className="w-20 h-20 rounded object-cover" />
            <div className="flex-1">
                <h3 className="font-extrabold">{cartItem.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <Button
                        variant="outline"
                        className="h-8 w-8 rounded-full"
                        size="icon"
                        disabled={cartItem.quantity === 1}
                        onClick={() => handleUpdateQuantity(cartItem, "minus")}
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold">{cartItem.quantity}</span>
                    <Button
                        variant="outline"
                        className="h-8 w-8 rounded-full"
                        size="icon"
                        onClick={() => handleUpdateQuantity(cartItem, "plus")}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <p className="font-semibold">
                ₹
                    {(
                        (cartItem.salePrice > 0 ? cartItem.salePrice : cartItem.price) *
                        cartItem.quantity
                    ).toFixed(2)}
                </p>
                <Trash onClick={() => handleCartItemDelete(cartItem)} className="cursor-pointer mt-1" size={20} />
            </div>
        </div>
    );
}

export default UserCartItemsContent;