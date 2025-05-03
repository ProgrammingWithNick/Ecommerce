import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from 'src/models/cart.schema';
import { Product, ProductDocument } from 'src/models/product.schema';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) { }

    private async validateUserAndProductIds(userId: string, productId?: string) {
        if (!userId || !Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid user ID');
        }
        if (productId && !Types.ObjectId.isValid(productId)) {
            throw new BadRequestException('Invalid product ID');
        }
    }

    private async getCartByUserId(userId: string) {
        return this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
    }

    private formatCartItems(cart: any) {
        return cart.items
            .filter(
                (item) =>
                    item.productId &&
                    typeof (item.productId as any).title === 'string'
            )
            .map((item) => {
                const productData = item.productId as unknown as ProductDocument;
                return {
                    productId: productData._id,
                    image: productData.image,
                    title: productData.title,
                    price: productData.price,
                    salePrice: productData.salePrice,
                    quantity: item.quantity,
                };
            });
    }


    async addToCart(userId: string, productId: string, quantity: number) {
        try {
            if (!userId || !productId || quantity <= 0) {
                throw new BadRequestException('Invalid data provided!');
            }

            await this.validateUserAndProductIds(userId, productId);

            const product = await this.productModel.findById(productId);
            if (!product) {
                throw new NotFoundException('Product not found');
            }

            let cart = await this.getCartByUserId(userId);
            if (!cart) {
                cart = new this.cartModel({
                    userId: new Types.ObjectId(userId),
                    items: [],
                });
            }

            // Clean any invalid items
            cart.items = cart.items.filter(item =>
                item && item.productId && item.quantity
            );

            const existingIndex = cart.items.findIndex(
                (item) => item.productId?.toString() === productId,
            );

            if (existingIndex === -1) {
                cart.items.push({
                    productId: new Types.ObjectId(productId),
                    quantity: quantity,
                });
            } else {
                cart.items[existingIndex].quantity += quantity;
            }

            // Debug logging
            console.log('Cart before save:', JSON.stringify({
                userId: cart.userId,
                items: cart.items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            }));

            const savedCart = await cart.save();
            await savedCart.populate('items.productId', 'image title price salePrice');

            const formattedItems = this.formatCartItems(savedCart);
            const addedItem = formattedItems.find(item => item.productId.toString() === productId);

            // Return in the format expected by the frontend
            return {
                success: true,
                cartItem: addedItem || null
            };
        } catch (error) {
            console.error('Error saving cart:', error);
            throw new InternalServerErrorException({
                success: false,
                message: 'Error saving cart'
            });
        }
    }


    async fetchCartItems(userId: string) {
        if (!userId) {
            throw new BadRequestException('User ID is mandatory!');
        }

        await this.validateUserAndProductIds(userId);

        const cart = await this.getCartByUserId(userId);

        if (!cart) {
            return { userId, items: [] };
        }

        await cart.populate('items.productId', 'image title price salePrice');

        return {
            userId: cart.userId,
            _id: cart._id,
            items: this.formatCartItems(cart),
        };
    }

    async updateCartItemQty(userId: string, productId: string, quantity: number) {
        if (!userId || !productId || quantity < 0) {
            throw new BadRequestException('Invalid data provided!');
        }

        await this.validateUserAndProductIds(userId, productId);

        const cart = await this.getCartByUserId(userId);
        if (!cart) {
            throw new NotFoundException('Cart not found!');
        }

        const index = cart.items.findIndex(
            (item) =>
                item.productId &&
                item.productId.toString() === productId
        );

        if (index === -1) {
            throw new NotFoundException('Cart item not present!');
        }

        if (quantity === 0) {
            cart.items.splice(index, 1);
        } else {
            cart.items[index].quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.productId', 'image title price salePrice');

        const updatedItem = this.formatCartItems(cart).find(
            (item) => item.productId.toString() === productId
        );

        return {
            success: true,
            updatedItem,
        };
    }

    async deleteCartItem(userId: string, productId: string) {
        if (!userId || !productId) {
            throw new BadRequestException('Invalid data provided!');
        }

        await this.validateUserAndProductIds(userId, productId);

        const cart = await this.getCartByUserId(userId);
        if (!cart) {
            throw new NotFoundException('Cart not found!');
        }

        cart.items = cart.items.filter(
            (item) =>
                item.productId &&
                item.productId.toString() !== productId
        );

        await cart.save();
        await cart.populate('items.productId', 'image title price salePrice');

        return {
            userId: cart.userId,
            _id: cart._id,
            items: this.formatCartItems(cart),
        };
    }

    async clearCart(userId: string) {
        if (!userId) {
            throw new BadRequestException('User ID is mandatory!');
        }

        await this.validateUserAndProductIds(userId);

        const cart = await this.getCartByUserId(userId);
        if (!cart) {
            return { userId, items: [] };
        }

        cart.items = [];
        await cart.save();

        return {
            userId: cart.userId,
            _id: cart._id,
            items: [],
        };
    }
}
