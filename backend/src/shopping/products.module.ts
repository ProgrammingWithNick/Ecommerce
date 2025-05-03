// shopping/products.module.ts

import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../models/product.schema';
import { CartModule } from './cart/cart.module';
import { AddressModule } from './address/address.module';
import { OrderModule } from './order/order.module';
import { SearchModule } from './search/search.module';
import { ReviewModule } from './review/review.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), CartModule, AddressModule, OrderModule, SearchModule, ReviewModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
