import {
    BadgeCheck,
    ChartNoAxesCombined,
    LayoutDashboard,
    ShoppingBasket,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "../ui/sheet";

type MenuItemsProps = {
    setOpen?: (open: boolean) => void;
};

const adminSidebarMenuItems = [
    {
        id: "dashboard",
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: <LayoutDashboard />,
    },
    {
        id: "products",
        label: "Products",
        path: "/admin/products",
        icon: <ShoppingBasket />,
    },
    {
        id: "orders",
        label: "Orders",
        path: "/admin/orders",
        icon: <BadgeCheck />,
    },
];

function MenuItems({ setOpen }: MenuItemsProps) {
    const navigate = useNavigate();

    const handleClick = (path: string) => {
        navigate(path);
        if (setOpen) setOpen(false);
    };

    return (
        <nav className="mt-8 flex flex-col gap-2">
            {adminSidebarMenuItems.map((item) => (
                <div
                    key={item.id}
                    onClick={() => handleClick(item.path)}
                    className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                    {item.icon}
                    <span>{item.label}</span>
                </div>
            ))}
        </nav>
    );
}

type AdminSideBarProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

function AdminSideBar({ open, setOpen }: AdminSideBarProps) {
    const navigate = useNavigate();

    return (
        <Fragment>
            {/* Mobile Sidebar */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="w-64">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="border-b">
                            <SheetTitle asChild>
                                <div className="flex gap-2 items-center mt-5 mb-2">
                                    <ChartNoAxesCombined size={30} />
                                    <span className="text-2xl font-extrabold">Admin Panel</span>
                                </div>
                            </SheetTitle>
                            <SheetDescription>
                                Use the sidebar to manage dashboard, products and orders.
                            </SheetDescription>
                        </SheetHeader>
                        <MenuItems setOpen={setOpen} />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
                <div
                    onClick={() => navigate("/admin/dashboard")}
                    className="flex cursor-pointer items-center gap-2"
                >
                    <ChartNoAxesCombined size={30} />
                    <span className="text-2xl font-extrabold">Admin Panel</span>
                </div>
                <MenuItems />
            </aside>
        </Fragment>
    );
}

export default AdminSideBar;
