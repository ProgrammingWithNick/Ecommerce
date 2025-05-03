import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Controller('shop/cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post('add')
  async addToCart(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: AddToCartDto,
  ) {
    try {
      const { userId, productId, quantity } = body;
      const result = await this.cartService.addToCart(userId, productId, quantity);
      return result; // Now returning the proper format
    } catch (error) {
      console.error('Add to cart failed:', error);
      throw new BadRequestException({
        success: false,
        message: error.message || 'Failed to add to cart'
      });
    }
  }

  @Get('get/:userId')
  async fetchCart(@Param('userId') userId: string) {
    try {
      return await this.cartService.fetchCartItems(userId);
    } catch (error) {
      console.error('Fetch cart failed:', error);
      throw new BadRequestException(error.message || 'Failed to fetch cart');
    }
  }

  @Put('update-cart')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateCartQty(@Body() body: UpdateCartItemDto) {
    try {
      const { userId, productId, quantity } = body;
      return await this.cartService.updateCartItemQty(userId, productId, quantity);
    } catch (error) {
      console.error('Update cart failed:', error);
      throw new BadRequestException(error.message || 'Failed to update cart item');
    }
  }

  @Delete('delete/:userId/:productId')
  async deleteCartItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    try {
      return await this.cartService.deleteCartItem(userId, productId);
    } catch (error) {
      console.error('Delete cart item failed:', error);
      throw new BadRequestException(error.message || 'Failed to delete cart item');
    }
  }
}
