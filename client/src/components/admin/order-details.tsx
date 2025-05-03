import { useState, FormEvent } from "react";
import CommonForm from "../common/form";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllOrdersForAdmin,
    getOrderDetailsForAdmin,
    updateOrderStatus,
} from "@/store/admin/order-slice";
import { toast } from "sonner";
import { RootState, AppDispatch } from "@/store/store";

interface CartItem {
    title: string;
    quantity: number;
    price: number;
}

interface AddressInfo {
    address: string;
    city: string;
    pincode: string;
    phone: string;
    notes?: string;
}

interface OrderDetails {
    _id: string;
    orderDate: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    cartItems: CartItem[];
    addressInfo: AddressInfo;
}

interface Props {
    orderDetails: OrderDetails | null;
}

const initialFormData = {
    status: "",
};

// Create an enum for order statuses to match backend values
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

function AdminOrderDetailsView({ orderDetails }: Props) {
    const [formData, setFormData] = useState(initialFormData);
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleUpdateStatus = async (event: FormEvent) => {
        event.preventDefault();
        const { status } = formData;

        if (!orderDetails?._id || !status) {
            toast.error("Order ID or status is missing");
            return;
        }

        try {
            const result = await dispatch(updateOrderStatus({ id: orderDetails._id, orderStatus: status }));

            if (updateOrderStatus.fulfilled.match(result)) {
                toast.success(result.payload.message);
                await dispatch(getOrderDetailsForAdmin(orderDetails._id));
                await dispatch(getAllOrdersForAdmin());
                setFormData(initialFormData);
            } else {
                toast.error((result as any)?.payload?.message || "Failed to update status");
            }
        } catch (err) {
            toast.error("Unexpected error updating status");
        }
    };

    if (!orderDetails) return null;

    return (
        <div className="grid gap-4 p-1">
            <h3 className="text-lg font-medium">Order Information</h3>
            
            <div className="grid gap-2">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Order ID</p>
                    <Label className="text-sm break-all max-w-[60%] text-right">{orderDetails._id}</Label>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Order Date</p>
                    <Label className="text-sm">{new Date(orderDetails.orderDate).toLocaleDateString()}</Label>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Order Price</p>
                    <Label className="text-sm">₹{orderDetails.totalAmount.toFixed(2)}</Label>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Payment Method</p>
                    <Label className="text-sm">{orderDetails.paymentMethod}</Label>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Payment Status</p>
                    <Label className="text-sm">{orderDetails.paymentStatus}</Label>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Order Status</p>
                    <Badge
                        className={`py-1 px-3 ${orderDetails.orderStatus === "confirmed"
                            ? "bg-green-500 text-white"
                            : orderDetails.orderStatus === "rejected"
                                ? "bg-red-600 text-white"
                                : "bg-gray-500 text-white"
                            }`}
                    >
                        {orderDetails.orderStatus}
                    </Badge>
                </div>
            </div>

            <Separator />

            <div>
                <p className="text-md font-medium mb-2">Order Details</p>
                <div className="max-h-48 overflow-y-auto rounded border border-gray-200 p-2">
                    <ul className="grid gap-2">
                        {orderDetails.cartItems.map((item, index) => (
                            <li key={index} className="flex justify-between text-sm">
                                <span className="truncate max-w-[40%]">{item.title}</span>
                                <span>Qty: {item.quantity}</span>
                                <span>₹{(isNaN(Number(item.price)) ? 0 : Number(item.price)).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div>
                <p className="text-md font-medium mb-2">Shipping Info</p>
                <div className="text-sm text-muted-foreground border border-gray-200 rounded p-2">
                    <p>{user?.userName}</p>
                    <p className="break-words">{orderDetails.addressInfo.address}</p>
                    <p>{orderDetails.addressInfo.city}, {orderDetails.addressInfo.pincode}</p>
                    <p>Phone: {orderDetails.addressInfo.phone}</p>
                    {orderDetails.addressInfo.notes && <p className="break-words">Notes: {orderDetails.addressInfo.notes}</p>}
                </div>
            </div>

            <Separator />

            <div>
                <p className="text-md font-medium mb-2">Update Status</p>
                <CommonForm
                    formControls={[
                        {
                            label: "Order Status",
                            name: "status",
                            componentType: "select",
                            options: [
                                { id: "pending", label: "Pending" },
                                { id: "processing", label: "Processing" },
                                { id: "shipped", label: "Shipped" },
                                { id: "delivered", label: "Delivered" },
                                { id: "cancelled", label: "Cancelled" },
                            ],
                            placeholder: "Select order status",
                        },
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText="Update Order Status"
                    onSubmit={handleUpdateStatus}
                />
            </div>
        </div>
    );
}

export default AdminOrderDetailsView;