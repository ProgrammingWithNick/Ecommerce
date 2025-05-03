import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { AppDispatch } from "@/store/store";

function PaypalReturnPage() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("paymentId");
    const payerId = params.get("PayerID");
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (paymentId && payerId) {
            // Get the raw value from sessionStorage first
            const rawOrderId = sessionStorage.getItem("currentOrderId");
            console.log("Raw value from sessionStorage:", rawOrderId);
            
            let orderId;
            
            // Check if it's already a simple string (not requiring JSON parsing)
            if (rawOrderId && !rawOrderId.startsWith('"') && !rawOrderId.startsWith('[') && !rawOrderId.startsWith('{')) {
                // It's likely a plain string ID, use it directly
                orderId = rawOrderId;
                console.log("Using raw orderId:", orderId);
            } else {
                // Try to parse it as JSON
                try {
                    orderId = JSON.parse(rawOrderId || "null");
                    console.log("Parsed orderId:", orderId);
                } catch (err) {
                    console.error("Error parsing order ID:", err);
                    setError("Failed to retrieve order information. Please contact support.");
                    
                    // For debugging - log exactly what's in the session storage
                    if (rawOrderId) {
                        console.log("Problem value:", rawOrderId);
                        console.log("Character at position 3:", rawOrderId.charAt(3));
                    }
                    return;
                }
            }
            
            if (orderId) {
                dispatch(capturePayment({ paymentId, payerId, orderId }) as any)
                    .then((data: any) => {
                        if (data?.payload?.success) {
                            sessionStorage.removeItem("currentOrderId");
                            window.location.href = "/shop/payment-success";
                        } else {
                            setError("Payment processing failed. Please try again or contact support.");
                        }
                    })
                    .catch((err: any) => {
                        console.error("Payment capture error:", err);
                        setError("Payment processing error. Please contact support.");
                    });
            } else {
                setError("Order information not found. Please try again or contact support.");
            }
        }
    }, [paymentId, payerId, dispatch]);
    
    return (
        <Card>
            <CardHeader>
                {error ? (
                    <CardTitle className="text-red-500">{error}</CardTitle>
                ) : (
                    <CardTitle>Processing Payment... Please wait!</CardTitle>
                )}
            </CardHeader>
        </Card>
    );
}

export default PaypalReturnPage;