// src/products/products.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
    constructor(@InjectModel('Product') private productModel: Model<Product>) {}

    // Create a new product
    async createProduct(data: Partial<Product>): Promise<Product> {
        try {
            const newProduct = new this.productModel(data);
            return await newProduct.save();
        } catch (error) {
            throw new InternalServerErrorException('Failed to create product');
        }
    }

    // Get all products
    async getAllProducts(): Promise<Product[]> {
        try {
            return await this.productModel.find();
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve products');
        }
    }

    // Edit an existing product
    async editProduct(id: string, data: Partial<Product>): Promise<Product> {
        try {
            const updatedProduct = await this.productModel.findByIdAndUpdate(id, data, { new: true });
            if (!updatedProduct) {
                throw new NotFoundException('Product not found');
            }
            return updatedProduct;
        } catch (error) {
            if (error.name === 'CastError') {
                throw new NotFoundException('Product not found');
            }
            throw new InternalServerErrorException('Failed to update product');
        }
    }

    // Delete a product
    async deleteProduct(id: string): Promise<void> {
        try {
            const result = await this.productModel.findByIdAndDelete(id);
            if (!result) {
                throw new NotFoundException('Product not found');
            }
        } catch (error) {
            if (error.name === 'CastError') {
                throw new NotFoundException('Product not found');
            }
            throw new InternalServerErrorException('Failed to delete product');
        }
    }
}
