// types/order.types.ts
export interface CartItem {
    _id: string;
    productId: string;
    title: string;
    quantity: number;
    price: number;
}

export interface AddressInfo {
    address: string;
    city: string;
    pincode: string;
    phone: string;
    notes: string;
}

export interface OrderDetails {
    _id: string;
    orderDate: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    cartItems: CartItem[];
    addressInfo: AddressInfo;
}

export interface OrderItem {
    _id: string;
    orderDate: string;
    orderStatus: string;
    totalAmount: number;
}