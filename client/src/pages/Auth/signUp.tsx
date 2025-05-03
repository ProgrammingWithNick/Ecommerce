import { useState, FormEvent } from "react";
import CommonForm from "@/components/common/form";
import { toast } from "sonner";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { Link, useNavigate } from "react-router-dom";

// Define the shape of your form state
interface RegisterFormState {
    userName: string;
    email: string;
    password: string;
}

const initialState: RegisterFormState = {
    userName: "",
    email: "",
    password: "",
};

function SignUp() {
    const [formData, setFormData] = useState<RegisterFormState>(initialState);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        dispatch(registerUser(formData)).then((data: any) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message || "Registration successful");
                navigate("/auth/login");
            } else {
                toast.error(data?.payload?.message || "Registration failed");
            }
        });
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Create new account
                </h1>
                <p className="mt-2">
                    Already have an account?
                    <Link
                        className="font-medium ml-2 text-primary hover:underline"
                        to="/auth/login"
                    >
                        Login
                    </Link>
                </p>
            </div>
            <CommonForm<RegisterFormState>
                formControls={registerFormControls}
                buttonText="Sign Up"
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </div>
    );
}

export default SignUp;
