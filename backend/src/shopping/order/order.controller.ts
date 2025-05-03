import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CapturePaymentDto } from './dto/capture-payment.dto';

@Controller('shop/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() body: CreateOrderDto) {
    return this.orderService.createOrder(body);
  }

  @Post('capture')
  capturePayment(@Body() body: CapturePaymentDto) {
    return this.orderService.capturePayment(body);
  }

  @Get('user/:userId')
  getOrdersByUser(@Param('userId') userId: string) {
    return this.orderService.getAllOrdersByUser(userId);
  }

  @Get(':id')
  getOrderDetails(@Param('id') id: string) {
    return this.orderService.getOrderDetails(id);
  }
}
