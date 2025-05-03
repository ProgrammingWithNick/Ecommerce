import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { OrderDetails } from "@/types/order.types";
import { RootState } from "@/store/store";

function ShoppingOrderDetailsView({ orderDetails }: { orderDetails: OrderDetails }) {
    const { user } = useSelector((state: RootState) => state.auth);

    const getFormattedDate = (dateStr: string) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    };

    const badgeColor =
        orderDetails.orderStatus === "confirmed"
            ? "bg-green-500"
            : orderDetails.orderStatus === "rejected"
                ? "bg-red-600"
                : "bg-black";

    return (
        <DialogContent className="sm:max-w-[600px]">
            <div className="grid gap-6">
                {/* Order Info */}
                <div className="grid gap-2">
                    <InfoRow label="Order ID" value={orderDetails._id} />
                    <InfoRow
                        label="Order Date"
                        value={getFormattedDate(orderDetails.orderDate)}
                    />
                    <InfoRow
                        label="Order Price"
                        value={`₹${Number(orderDetails.totalAmount).toFixed(2)}`}
                    />
                    <InfoRow label="Payment Method" value={orderDetails.paymentMethod} />
                    <InfoRow label="Payment Status" value={orderDetails.paymentStatus} />
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Order Status</p>
                        <Badge className={`py-1 px-3 capitalize ${badgeColor}`}>
                            {orderDetails.orderStatus}
                        </Badge>
                    </div>
                </div>

                <Separator />

                {/* Items */}
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Order Details</div>
                        <ul className="grid gap-3">
                            {orderDetails.cartItems.map((item) => (
                                <li
                                    key={item._id}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span>Title: {item.title}</span>
                                    <span>Qty: {item.quantity}</span>
                                    <span>
                                        ₹
                                        {!isNaN(Number(item.price))
                                            ? Number(item.price).toFixed(2)
                                            : "-"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Address */}
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Shipping Info</div>
                        <div className="grid gap-0.5 text-muted-foreground text-sm">
                            <span>{user?.userName || "-"}</span>
                            <span>{orderDetails.addressInfo.address || "-"}</span>
                            <span>{orderDetails.addressInfo.city || "-"}</span>
                            <span>{orderDetails.addressInfo.pincode || "-"}</span>
                            <span>{orderDetails.addressInfo.phone || "-"}</span>
                            <span>{orderDetails.addressInfo.notes || "-"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}

// Extracted for reuse
const InfoRow = ({ label, value }: { label: string; value: string | number | null }) => (
    <div className="flex mt-2 items-center justify-between text-sm">
        <p className="font-medium">{label}</p>
        <Label>{value ?? "-"}</Label>
    </div>
);

export default ShoppingOrderDetailsView;
