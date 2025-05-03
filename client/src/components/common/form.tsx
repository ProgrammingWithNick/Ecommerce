import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

type FormControlOption = {
    id: string;
    label: string;
};

export type FormControlItem = {
    name: string;
    label: string;
    placeholder?: string;
    componentType: "input" | "select" | "textarea";
    type?: string;
    id?: string;
    options?: FormControlOption[];
};

type CommonFormProps<T> = {
    formControls: FormControlItem[];
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    buttonText?: string;
    isBtnDisabled?: boolean;
    title?: string;
    subtitle?: string;
    onClose?: () => void;
};

function CommonForm<T extends Record<string, any>>({
    formControls,
    formData,
    setFormData,
    onSubmit,
    buttonText = "Submit",
    isBtnDisabled = false,
    title,
    subtitle,
    onClose,
}: CommonFormProps<T>) {
    const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
    // Removed unused formValid state
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const togglePasswordVisibility = (name: string) => {
        setVisiblePasswords((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const handleChange = (name: string, value: string | number | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (!touched[name]) {
            setTouched((prev) => ({
                ...prev,
                [name]: true,
            }));
        }
    };

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setTouched(
            formControls.reduce((acc, control) => {
                acc[control.name] = true;
                return acc;
            }, {} as Record<string, boolean>)
        );

        if (!isBtnDisabled) {
            try {
                await onSubmit(e);
                if (onClose) {
                    setTimeout(() => {
                        onClose();
                    }, 0);
                }
            } catch (error) {
                console.error("Form submission error:", error);
            }
        }
    };

    const renderInput = (control: FormControlItem) => {
        const value = formData[control.name] ?? "";
        const isTouched = touched[control.name];
        const isEmpty = value === "" || value === null || value === undefined;

        switch (control.componentType) {
            case "input": {
                const isPassword = control.type === "password";
                const isVisible = visiblePasswords[control.name] ?? false;

                return (
                    <div className="relative">
                        <Input
                            id={control.name}
                            name={control.name}
                            type={isPassword && isVisible ? "text" : control.type || "text"}
                            placeholder={control.placeholder}
                            value={value}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleChange(control.name, e.target.value)
                            }
                            onBlur={() => {
                                if (!touched[control.name]) {
                                    setTouched((prev) => ({
                                        ...prev,
                                        [control.name]: true,
                                    }));
                                }
                            }}
                            className={`rounded-xl border-2 transition-all duration-200 focus:ring-2 border-gray-200 focus:border-indigo-500 focus:ring-indigo-200 ${isPassword ? "pr-10" : ""
                                }`}
                        />
                        {isPassword && (
                            <span
                                onClick={() => togglePasswordVisibility(control.name)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
                            >
                                {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                        )}
                        {!isPassword && isTouched && !isEmpty && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                <CheckCircle size={18} className="text-green-500" />
                            </span>
                        )}
                    </div>
                );
            }

            case "select":
                return (
                    <div className="relative">
                        <Select
                            value={value}
                            onValueChange={(val: string) => handleChange(control.name, val)}
                            onOpenChange={() => {
                                if (!touched[control.name]) {
                                    setTouched((prev) => ({
                                        ...prev,
                                        [control.name]: true,
                                    }));
                                }
                            }}
                        >
                            <SelectTrigger className="w-full rounded-xl border-2 transition-all duration-200 border-gray-200">
                                <SelectValue placeholder={control.placeholder || control.label} />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-lg border-0 overflow-hidden">
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-2 border-b">
                                    <p className="text-sm font-medium text-gray-600">
                                        Select {control.label.toLowerCase()}
                                    </p>
                                </div>
                                {control.options?.map((opt) => (
                                    <SelectItem
                                        key={opt.id}
                                        value={opt.id}
                                        className="hover:bg-indigo-50 cursor-pointer transition-colors"
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {isTouched && !isEmpty && (
                            <span className="absolute right-10 top-1/2 -translate-y-1/2">
                                <CheckCircle size={18} className="text-green-500" />
                            </span>
                        )}
                    </div>
                );

            case "textarea":
                return (
                    <div className="relative">
                        <Textarea
                            id={control.id || control.name}
                            name={control.name}
                            placeholder={control.placeholder}
                            value={value}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                handleChange(control.name, e.target.value)
                            }
                            onBlur={() => {
                                if (!touched[control.name]) {
                                    setTouched((prev) => ({
                                        ...prev,
                                        [control.name]: true,
                                    }));
                                }
                            }}
                            className="rounded-xl min-h-32 border-2 transition-all duration-200 border-gray-200 focus:border-indigo-500 focus:ring-indigo-200 focus:ring-2"
                        />
                        {isTouched && !isEmpty && (
                            <span className="absolute right-3 top-3">
                                <CheckCircle size={18} className="text-green-500" />
                            </span>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    // Removed unused useEffect for formValid

    return (
        <form
            onSubmit={handleFormSubmit}
            className="max-w-xl mx-auto p-8 bg-white rounded-3xl shadow-xl space-y-6 border border-gray-100"
        >
            {(title || subtitle) && (
                <div className="mb-8 text-center">
                    {title && (
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            {title}
                        </h3>
                    )}
                    {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
                    <div className="mt-4 h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
                </div>
            )}

            <div className="flex flex-col gap-6">
                {formControls.map((control) => (
                    <div className="grid w-full gap-2" key={control.name}>
                        <Label
                            className="text-sm font-medium flex items-center gap-1"
                            htmlFor={control.name}
                        >
                            {control.label}
                        </Label>
                        {renderInput(control)}
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                    type="submit"
                    disabled={isBtnDisabled}
                    className={`flex-1 group relative overflow-hidden py-3 rounded-xl font-medium text-white shadow-lg transition-all duration-300 ${isBtnDisabled
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                        }`}
                >
                    <span className="relative z-10">{buttonText}</span>
                    {!isBtnDisabled && (
                        <span className="absolute bottom-0 left-0 h-full w-0 bg-gradient-to-r from-purple-700 to-indigo-800 transition-all duration-300 group-hover:w-full"></span>
                    )}
                </Button>
                {onClose && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 rounded-xl"
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}

export default CommonForm;
