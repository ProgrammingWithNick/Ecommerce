import { AlignJustify, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { logoutUser } from "@/store/authSlice";
import type { AppDispatch } from "@/store/store";

function AdminHeader({ setOpen }: { setOpen: (open: boolean) => void }) {
    const dispatch = useDispatch<AppDispatch>(); // ✅ Correctly typed dispatch

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
            <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
                <AlignJustify />
                <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="flex flex-1 justify-end">
                <Button
                    onClick={handleLogout}
                    className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
                >
                    <LogOut />
                    Logout
                </Button>
            </div>
        </header>
    );
}

export default AdminHeader;
