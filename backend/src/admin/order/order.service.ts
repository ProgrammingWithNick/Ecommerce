// src/order/order.service.ts
import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order, OrderDocument } from 'src/models/order.schema';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    ) {}

    async getAllOrdersOfAllUsers() {
        try {
            const orders = await this.orderModel.find().sort({ orderDate: -1 });
            if (!orders.length) {
                throw new NotFoundException('No orders found!');
            }
            return orders;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new InternalServerErrorException('Failed to fetch orders!');
        }
    }

    async getOrderDetailsForAdmin(id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid Order ID!');
        }

        const order = await this.orderModel.findById(id);
        if (!order) {
            throw new NotFoundException('Order not found!');
        }

        return order;
    }

    async updateOrderStatus(id: string, dto: UpdateOrderStatusDto) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid Order ID!');
        }

        const updated = await this.orderModel.findByIdAndUpdate(
            id,
            { orderStatus: dto.orderStatus },
            { new: true },
        );

        if (!updated) {
            throw new NotFoundException('Order not found!');
        }

        return {
            message: 'Order status updated successfully!',
            order: updated,
        };
    }
}
