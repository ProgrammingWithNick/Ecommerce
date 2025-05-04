import { useState, FormEvent } from "react";
import CommonForm from "@/components/common/form";
import { toast } from "sonner";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Link, useNavigate } from "react-router-dom";

const LogIn = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { loading, error } = useSelector(
        (state: RootState) => state.auth
    );

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Please fill in both fields.");
            return;
        }

        try {
            const resultAction = await dispatch(loginUser(formData));

            if (loginUser.fulfilled.match(resultAction)) {
                const { success, message, user } = resultAction.payload;

                if (success) {
                    toast.success(message || "Login successful!");
                    navigate(user?.role === "admin" ? "/admin/dashboard" : "/shop/home");
                } else {
                    toast.error(message || "Login failed.");
                }
            } else {
                toast.error(resultAction.payload as string);
            }
        } catch (err: any) {
            console.error("Login error:", err);
            toast.error("Unexpected error. Try again.");
        }
    };

    // If there's an error in the state, show it via toast
    if (error) {
        toast.error(error);
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Sign in to your account
                </h1>
                <p className="mt-2">
                    Don&apos;t have an account?{" "}
                    <Link
                        className="font-medium ml-2 text-primary hover:underline"
                        to="/auth/signup"
                    >
                        SignUp
                    </Link>
                </p>
            </div>

            <CommonForm
                formControls={loginFormControls}
                buttonText={loading ? "Signing in..." : "Sign In"}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleLogin}
                isBtnDisabled={loading}  // Corrected to match the expected prop
            />
            <div className="text-right text-sm">
                <Link
                    to="/auth/forgot-password"
                    className="text-primary hover:underline"
                >
                    Forgot password?
                </Link>
            </div>
        </div>
    );
};

export default LogIn;
