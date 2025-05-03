// src/shopping/product/schemas/product.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  category?: string;

  @Prop()
  brand?: string;

  @Prop()
  image?: string;

  @Prop()
  salePrice?: number;

  @Prop({ required: true, default: 0 })
  totalStock: number; 

  @Prop({ default: 0 })
  averageReview?: number;

}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
