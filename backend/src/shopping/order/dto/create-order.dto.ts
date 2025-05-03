// src/shopping/order/dto/create-order.dto.ts

import { IsNotEmpty, IsArray, IsString, IsNumber, IsObject, IsOptional } from 'class-validator';

class CartItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

class AddressInfoDto {
  @IsString()
  @IsNotEmpty()
  addressId: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  pincode: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  cartId: string;

  @IsArray()
  @IsNotEmpty()
  cartItems: CartItemDto[];

  @IsObject()
  @IsNotEmpty()
  addressInfo: AddressInfoDto;

  @IsString()
  @IsNotEmpty()
  orderStatus: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsString()
  @IsNotEmpty()
  paymentStatus: string;

  @IsNumber()
  totalAmount: number;

  @IsString()
  @IsNotEmpty()
  orderDate: string;

  @IsString()
  @IsNotEmpty()
  orderUpdateDate: string;

  @IsString()
  @IsOptional()
  paymentId?: string;

  @IsString()
  @IsOptional()
  payerId?: string;
}