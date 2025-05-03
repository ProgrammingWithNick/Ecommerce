// src/order/order.controller.ts

import {
  Controller,
  Get,
  Param,
  Body,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/common/guard/admin.guard';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrdersOfAllUsers() {
    const orders = await this.orderService.getAllOrdersOfAllUsers();
    return {
      success: true,
      data: orders,
      message: 'Orders fetched successfully',
    };
  }

  @Get(':id') // Keep this as-is
  async getOrderDetails(@Param('id') id: string) {
    const order = await this.orderService.getOrderDetailsForAdmin(id);
    return {
      success: true,
      data: order,
      message: 'Order details fetched successfully',
    };
  }

  @Put(':id')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const result = await this.orderService.updateOrderStatus(id, dto);
    return {
      success: true,
      data: result.order,
      message: result.message,
    };
  }
}
