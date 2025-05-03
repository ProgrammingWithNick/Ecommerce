import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllOrdersByUserId,
    getOrderDetails,
    resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { AppDispatch, RootState } from "@/store/store";
import { OrderDetails, OrderItem } from "@/types/order.types";

function ShoppingOrders() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { orderList, orderDetails } = useSelector((state: RootState) => state.shopOrder);

    // Type guard for OrderDetails
    const isOrderDetails = (order: any): order is OrderDetails => {
        return order &&
            Array.isArray(order.cartItems) &&
            order.cartItems.every((item: any) => item._id && item.productId);
    };

    useEffect(() => {
        if (user?.id) {
            dispatch(getAllOrdersByUserId(user.id));
        }
    }, [dispatch, user?.id]);

    useEffect(() => {
        if (orderDetails !== null) {
            setOpenDetailsDialog(true);
        }
    }, [orderDetails]);

    const handleViewDetails = (orderId: string) => {
        setSelectedOrderId(orderId);
        dispatch(getOrderDetails(orderId));
    };

    const getFormattedDate = (dateStr: string) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    };

    const getBadgeColor = (status: string) => {
        if (status === "confirmed") return "bg-green-500";
        if (status === "rejected") return "bg-red-600";
        return "bg-black";
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderList?.length > 0 ? (
                            orderList.map((orderItem: OrderItem) => (
                                <TableRow key={orderItem._id}>
                                    <TableCell>{orderItem._id}</TableCell>
                                    <TableCell>{getFormattedDate(orderItem.orderDate)}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`py-1 px-3 capitalize ${getBadgeColor(
                                                orderItem.orderStatus
                                            )}`}
                                        >
                                            {orderItem.orderStatus || "Unknown"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>₹{orderItem.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleViewDetails(orderItem._id)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Dialog
                    open={openDetailsDialog}
                    onOpenChange={(open) => {
                        setOpenDetailsDialog(open);
                        if (!open) {
                            dispatch(resetOrderDetails());
                            setSelectedOrderId(null);
                        }
                    }}
                >
                    {orderDetails && isOrderDetails(orderDetails) && (
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                    )}
                </Dialog>
            </CardContent>
        </Card>
    );
}

export default ShoppingOrders;