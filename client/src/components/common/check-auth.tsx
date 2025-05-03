import { ReactNode, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState, AppDispatch } from "@/store/store";
import { checkAuth } from "@/store/authSlice";

interface CheckAuthProps {
    children: ReactNode;
}

function CheckAuth({ children }: CheckAuthProps) {
    const { pathname } = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, user, loading, authChecked } = useSelector(
        (state: RootState) => state.auth
    );
    
    useEffect(() => {
        if (!authChecked) {
            dispatch(checkAuth());
        }
    }, [authChecked, dispatch]);

    // Show loading state while auth is being checked
    if (loading || !authChecked) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        </div>;
    }

    // Home route redirect logic
    if (pathname === "/") {
        if (!isAuthenticated) {
            return <Navigate to="/auth/login" replace />;
        }
        return (
            <Navigate
                to={user?.role === "admin" ? "/admin/dashboard" : "/shop/home"}
                replace
            />
        );
    }

    // Protected route logic
    if (!isAuthenticated && !pathname.startsWith("/auth") && !pathname.startsWith("/reset-password") && !pathname.startsWith("/unauth-page")) {
        return <Navigate to="/auth/login" replace />;
    }

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && pathname.startsWith("/auth")) {
        return (
            <Navigate
                to={user?.role === "admin" ? "/admin/dashboard" : "/shop/home"}
                replace
            />
        );
    }

    // Role-based access control
    if (isAuthenticated && user?.role === "user" && pathname.startsWith("/admin")) {
        return <Navigate to="/unauth-page" replace />;
    }

    if (isAuthenticated && user?.role === "admin" && pathname.startsWith("/shop")) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <>{children}</>;
}

export default CheckAuth;