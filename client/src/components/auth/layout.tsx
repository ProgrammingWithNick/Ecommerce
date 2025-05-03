import { Outlet } from 'react-router-dom';

function AuthLayout() {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Panel - visible on large screens */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-black px-12">
                <div className="max-w-md text-center text-white space-y-6">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Welcome to ECommerce Shopping
                    </h1>
                </div>
            </div>

            {/* Right Panel - always visible */}
            <div className="flex flex-1 items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
