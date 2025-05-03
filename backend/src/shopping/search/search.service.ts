import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/models/product.schema';

interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
}

interface SearchOptions {
  page?: number;
  limit?: number;
  sort?: string;
}

@Injectable()
export class SearchService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) { }

    async searchProducts(
        keyword: string, 
        filters: SearchFilters = {}, 
        options: SearchOptions = { page: 1, limit: 20, sort: 'relevance' }
    ): Promise<{ products: Product[]; total: number }> {
        if (!keyword || typeof keyword !== 'string') {
            throw new BadRequestException('Keyword is required and must be in string format');
        }

        const regEx = new RegExp(keyword, 'i');

        // Create base search query
        const searchQuery: any = {
            $or: [
                { title: regEx },
                { description: regEx },
                { category: regEx },
                { brand: regEx },
            ],
        };

        // Apply additional filters
        if (filters.category) {
            searchQuery.category = filters.category;
        }

        if (filters.brand) {
            searchQuery.brand = filters.brand;
        }

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            searchQuery.price = {};
            
            if (filters.minPrice !== undefined) {
                searchQuery.price.$gte = filters.minPrice;
            }
            
            if (filters.maxPrice !== undefined) {
                searchQuery.price.$lte = filters.maxPrice;
            }
        }

        // Calculate pagination
        const page = options.page || 1;
        const limit = options.limit || 20;
        const skip = (page - 1) * limit;

        // Determine sort order
        let sortOption = {};
        switch (options.sort) {
            case 'price-asc':
                sortOption = { price: 1 };
                break;
            case 'price-desc':
                sortOption = { price: -1 };
                break;
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            default:
                // Default relevance sort (could be more sophisticated in a real app)
                sortOption = { _id: -1 };
        }

        try {
            // Get total count for pagination
            const total = await this.productModel.countDocuments(searchQuery);
            
            // Get paginated results
            const products = await this.productModel
                .find(searchQuery)
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .exec();

            return { products, total };
        } catch (error) {
            console.error('Search error:', error);
            throw new InternalServerErrorException('Error while searching products');
        }
    }

    async getSearchSuggestions(keyword: string): Promise<string[]> {
        if (!keyword || typeof keyword !== 'string' || keyword.length < 2) {
            return [];
        }

        try {
            const regEx = new RegExp(keyword, 'i');
            
            // Find products matching the keyword
            const products = await this.productModel
                .find({ title: regEx })
                .select('title')
                .limit(5)
                .exec();
            
            // Extract and return unique titles
            return [...new Set(products.map(product => product.title))];
        } catch (error) {
            console.error('Error getting search suggestions:', error);
            return [];
        }
    }
}