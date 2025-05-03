// src/order/dto/update-order-status.dto.ts
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

// Add this to a shared constants file in your frontend
export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

export class UpdateOrderStatusDto {
    @IsNotEmpty()
    @IsEnum(OrderStatus, { message: 'Invalid order status' })
    orderStatus: OrderStatus;
}