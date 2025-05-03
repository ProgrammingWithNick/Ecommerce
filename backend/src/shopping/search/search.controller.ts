import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Product } from 'src/models/product.schema';

@Controller('shop/search')
export class SearchController {
  constructor(private readonly shoppingSearchService: SearchService) {}

  @Get(':keyword')
  async searchProducts(
    @Param('keyword') keyword: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('brand') brand?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('sort') sort?: string
  ): Promise<{ success: boolean; data: Product[] }> {
    // For backward compatibility with your current frontend implementation
    // the service returns {products, total} but we'll only use products for now
    const { products } = await this.shoppingSearchService.searchProducts(
      keyword,
      { category, minPrice, maxPrice, brand },
      { page, limit, sort }
    );
    
    return {
      success: true,
      data: products,
    };
  }

  @Get('suggestions/:keyword')
  async getSearchSuggestions(
    @Param('keyword') keyword: string
  ): Promise<{ success: boolean; data: string[] }> {
    const suggestions = await this.shoppingSearchService.getSearchSuggestions(keyword);
    
    return {
      success: true,
      data: suggestions,
    };
  }
}