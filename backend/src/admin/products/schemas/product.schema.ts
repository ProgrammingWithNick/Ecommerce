// src/products/schemas/product.schema.ts
import { Schema, Document } from 'mongoose';

export interface Product extends Document {
    image: string;
    title: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    salePrice: number;
    totalStock: number;
    averageReview: number;
}

export const ProductSchema = new Schema<Product>({
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
});
