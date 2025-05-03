import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CartSchema } from 'src/models/cart.schema';
import { ProductSchema } from 'src/models/product.schema';
import { PaypalProvider } from './paypal.provider';
import { OrderSchema } from 'src/models/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'Cart', schema: CartSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, PaypalProvider],
})
export class OrderModule {}
