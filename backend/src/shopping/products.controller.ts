import { Controller, Get, Query, Param, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('shop/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    async getFilteredProducts(@Query() query: any) {
        // console.log('Received query:', query);  
        try {
            const products = await this.productsService.getFilteredProducts(query);
            return {
                success: true,
                data: products,
            };
        } catch (error) {
            console.error('Error in controller:', error);
            throw new InternalServerErrorException('Failed to load products', error.message);
        }
    }


    @Get(':id')
    async getProductDetails(@Param('id') id: string) {
        try {
            const product = await this.productsService.getProductDetails(id);
            if (!product) {
                throw new NotFoundException('Product not found!');
            }
            return {
                success: true,
                data: product,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to load product details', error.message);
        }
    }
}
