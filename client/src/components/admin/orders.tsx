import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent } from "../ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllOrdersForAdmin,
    getOrderDetailsForAdmin,
    resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { AppDispatch, RootState } from "@/store/store";

interface Order {
    _id: string;
    orderDate: string;
    orderStatus: string;
    totalAmount: number;
}

function AdminOrdersView() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { orderList, orderDetails } = useSelector((state: RootState) => state.adminOrder);

    const handleViewDetails = async (id: string) => {
        await dispatch(getOrderDetailsForAdmin(id));
        setOpenDetailsDialog(true);
    };

    useEffect(() => {
        dispatch(getAllOrdersForAdmin());
    }, [dispatch]);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/5">Order ID</TableHead>
                                    <TableHead className="w-1/5">Order Date</TableHead>
                                    <TableHead className="w-1/5">Order Status</TableHead>
                                    <TableHead className="w-1/5">Order Price</TableHead>
                                    <TableHead className="w-1/5">
                                        <span className="sr-only">Details</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderList?.length > 0 &&
                                    orderList.map((orderItem: Order) => (
                                        <TableRow key={orderItem._id}>
                                            <TableCell className="max-w-[150px] truncate">{orderItem._id}</TableCell>
                                            <TableCell>{orderItem.orderDate.split("T")[0]}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={`py-1 px-3 ${
                                                        orderItem.orderStatus === "confirmed"
                                                            ? "bg-green-500"
                                                            : orderItem.orderStatus === "rejected"
                                                            ? "bg-red-600"
                                                            : "bg-gray-600"
                                                    }`}
                                                >
                                                    {orderItem.orderStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>₹{orderItem.totalAmount}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleViewDetails(orderItem._id)}>
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog
                open={openDetailsDialog}
                onOpenChange={(open) => {
                    setOpenDetailsDialog(open);
                    if (!open) dispatch(resetOrderDetails());
                }}
            >
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <AdminOrderDetailsView orderDetails={orderDetails} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AdminOrdersView;