import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../models/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

    async getFilteredProducts(query: any) {
        const { category = '', brand = '', sortBy = 'price-lowtohigh' } = query;

        const filters: any = {};
        if (category) {
            const categories = category.split(',').map((cat: string) => cat.trim());
            filters.category = { $in: categories };
        }
        if (brand) {
            const brands = brand.split(',').map((b: string) => b.trim());
            filters.brand = { $in: brands };
        }

        let sort: any = {};
        switch (sortBy) {
            case 'price-lowtohigh':
                sort.price = 1;
                break;
            case 'price-hightolow':
                sort.price = -1;
                break;
            case 'title-atoz':
                sort.title = 1;
                break;
            case 'title-ztoa':
                sort.title = -1;
                break;
            default:
                sort.price = 1;
        }

        try {
            return await this.productModel.find(filters).sort(sort);
        } catch (error) {
            // console.error('Error fetching filtered products:', error);
            throw new Error('Error fetching filtered products');
        }
    }

    async getProductDetails(id: string) {
        try {
            return await this.productModel.findById(id);
        } catch (error) {
            // console.error('Error fetching product details:', error);
            throw new Error('Error fetching product details');
        }
    }
}
