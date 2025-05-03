import {
    HousePlug,
    LogOut,
    Menu,
    ShoppingCart,
    UserCog,
} from "lucide-react";
import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/authSlice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/store/store";

// Define MenuItem interface
interface MenuItem {
    id: string;
    label: string;
    path: string;
}

function MenuItems() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    function handleNavigate(menuItem: MenuItem) {
        sessionStorage.removeItem("filters");

        const currentFilter =
            menuItem.id !== "home" &&
                menuItem.id !== "products" &&
                menuItem.id !== "search"
                ? { category: [menuItem.id] }
                : null;

        sessionStorage.setItem("filters", JSON.stringify(currentFilter));

        if (location.pathname.includes("listing") && currentFilter !== null) {
            setSearchParams(new URLSearchParams(`?category=${menuItem.id}`));
        } else {
            navigate(menuItem.path);
        }
    }

    return (
        <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
            {shoppingViewHeaderMenuItems.map((menuItem) => (
                <Label
                    onClick={() => handleNavigate(menuItem)}
                    className="text-sm font-medium cursor-pointer"
                    key={menuItem.id}
                >
                    {menuItem.label}
                </Label>
            ))}
        </nav>
    );
}

function HeaderRightContent() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { cartItems, isLoading } = useSelector((state: RootState) => state.shopCart);
    const [openCartSheet, setOpenCartSheet] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    function handleLogout() {
        dispatch(logoutUser())
            .unwrap()
            .then(() => {
                toast.success("Logged out!");
            })
            .catch(() => {
                toast.error("Logout failed. Try again.");
            });
    }

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchCartItems(user.id));
        }
    }, [dispatch, user?.id]);

    // Safe access to cartItems length
    const cartItemCount = Array.isArray(cartItems) ? cartItems.length : 0;

    return (
        <div className="flex lg:items-center lg:flex-row flex-col gap-4">
            <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
                <SheetTrigger asChild>
                    <Button
                        onClick={() => {
                            setOpenCartSheet(true);
                        }}
                        variant="outline"
                        size="icon"
                        className="relative"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
                            {cartItemCount}
                        </span>
                        <span className="sr-only">User cart</span>
                    </Button>
                </SheetTrigger>

                <UserCartWrapper
                    setOpenCartSheet={setOpenCartSheet}
                    cartItems={Array.isArray(cartItems) ? cartItems : []}
                />
            </Sheet>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="bg-black">
                        <AvatarFallback className="bg-black text-white font-extrabold">
                            {user?.userName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                    <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/shop/account")}>
                        <UserCog className="mr-2 h-4 w-4" />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

function ShoppingHeader() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <Link to="/shop/home" className="flex items-center gap-2">
                    <HousePlug className="h-6 w-6" />
                    <span className="font-bold">Ecommerce</span>
                </Link>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="lg:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle header menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-xs">
                        <MenuItems />
                        <HeaderRightContent />
                    </SheetContent>
                </Sheet>

                <div className="hidden lg:block">
                    <MenuItems />
                </div>
                <div className="hidden lg:block">
                    <HeaderRightContent />
                </div>
            </div>
        </header>
    );
}

export default ShoppingHeader;