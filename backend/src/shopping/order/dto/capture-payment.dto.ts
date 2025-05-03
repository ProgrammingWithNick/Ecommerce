// src/shopping/order/dto/capture-payment.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class CapturePaymentDto {
  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @IsNotEmpty()
  @IsString()
  payerId: string;

  @IsNotEmpty()
  @IsString()
  orderId: string;
}
