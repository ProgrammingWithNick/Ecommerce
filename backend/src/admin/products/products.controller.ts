// src/products/products.controller.ts
import {
    Controller,
    Post,
    Get,
    UseInterceptors,
    UploadedFile,
    Res,
    Body,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { imageUploadUtil } from '../../upload/upload.util';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

@Controller('admin/products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }

    // ✅ Add this GET endpoint
    @Get()
    async getAllProducts(@Res() res: Response) {
        try {
            const products = await this.productService.getAllProducts();
            return res.json({ data: products });
        } catch (error) {
            console.error('Failed to fetch products:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch products',
            });
        }
    }

    // Upload image endpoint
    @Post('upload-image')
    @UseInterceptors(FileInterceptor('my_file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        try {
            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded',
                });
            }

            const b64 = Buffer.from(file.buffer).toString('base64');
            const url = `data:${file.mimetype};base64,${b64}`;
            const result = await imageUploadUtil(url);

            return res.json({
                success: true,
                result,
            });
        } catch (error) {
            console.error('Error during image upload:', error);
            return res.status(500).json({
                success: false,
                message: 'Image upload failed',
            });
        }
    }

    // ✅ Add product
    @Post('add')
    async addProduct(@Body() data: Partial<Product>, @Res() res: Response) {
        try {
            const product = await this.productService.createProduct(data);
            return res.json(product);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to add product',
            });
        }
    }

    // ✅ Edit product
    @Put('edit/:id')
    async editProduct(@Param('id') id: string, @Body() data: Partial<Product>, @Res() res: Response) {
        try {
            const updated = await this.productService.editProduct(id, data);
            return res.json(updated);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update product',
            });
        }
    }

    // ✅ Delete product
    @Delete('delete/:id')
    async deleteProduct(@Param('id') id: string, @Res() res: Response) {
        try {
            await this.productService.deleteProduct(id);
            return res.json({ success: true });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete product',
            });
        }
    }
}
