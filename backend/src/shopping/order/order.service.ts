import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { CapturePaymentDto } from './dto/capture-payment.dto';
import { Order } from 'src/models/order.schema';
import { Cart } from 'src/models/cart.schema';
import { Product } from 'src/models/product.schema';

@Injectable()
export class OrderService {
  constructor(
    @Inject('PAYPAL_SDK') private readonly paypal,
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectModel('Cart') private cartModel: Model<Cart>,
    @InjectModel('Product') private productModel: Model<Product>,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = dto;
  
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: 'http://localhost:5173/shop/paypal-return',
        cancel_url: 'http://localhost:5173/shop/paypal-cancel',
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2), // 👈 Must be string, 2 decimal places
              currency: 'USD', // ✅ Make sure it's USD
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: 'USD', // ✅ USD only
            total: totalAmount.toFixed(2),
          },
          description: 'Purchase from online store',
        },
      ],
    };
  
    try {
      // 👇 Create PayPal Payment
      const paymentInfo = await new Promise<{ links: { rel: string; href: string }[] }>((resolve, reject) => {
        this.paypal.payment.create(create_payment_json, (error, payment) => {
          if (error) {
            console.error('PayPal Create Error:', error);
            reject(new Error('Failed to create PayPal payment'));
          } else {
            resolve(payment);
          }
        });
      });
  
      // 👇 Store order in DB
      const newOrder = new this.orderModel({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate: orderDate || new Date().toISOString(),
        orderUpdateDate: orderUpdateDate || new Date().toISOString(),
        ...(paymentId && { paymentId }),
        ...(payerId && { payerId }),
      });
  
      await newOrder.save();
  
      // 👇 Extract approval URL
      const approvalURL = paymentInfo.links.find((link) => link.rel === 'approval_url')?.href;
      if (!approvalURL) {
        throw new Error('PayPal approval URL not found');
      }
  
      return {
        success: true,
        approvalURL,
        orderId: newOrder._id,
      };
    } catch (error) {
      console.error('Order Creation Error:', error);
  
      return {
        success: false,
        message: error.message || 'Something went wrong while creating the order',
      };
    }
  }
  

  async capturePayment(dto: CapturePaymentDto) {
    const { paymentId, payerId, orderId } = dto;

    try {
      const order = await this.orderModel.findById(orderId);
      if (!order) {
        return { success: false, message: 'Order not found' };
      }

      // Update order with payment information
      order.paymentStatus = 'completed';
      order.orderStatus = 'processing';
      order.paymentId = paymentId;
      order.payerId = payerId;

      // Update stock for each product
      for (const item of order.cartItems) {
        const product = await this.productModel.findById(item.productId);
        if (!product) {
          return {
            success: false,
            message: `Product not found: ${item.title}`,
          };
        }

        if (product.totalStock < item.quantity) {
          return {
            success: false,
            message: `Not enough stock for product ${item.title}`,
          };
        }

        product.totalStock -= item.quantity;
        await product.save();
      }

      // Remove the cart after successful payment
      await this.cartModel.findByIdAndDelete(order.cartId);
      await order.save();

      return {
        success: true,
        message: 'Order confirmed and stock updated',
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error occurred during payment capture',
      };
    }
  }

  async getAllOrdersByUser(userId: string) {
    try {
      const orders = await this.orderModel.find({ userId }).sort({ orderDate: -1 });
      
      return { 
        success: true, 
        data: orders,
        message: orders.length ? null : 'No orders found'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error occurred while fetching orders',
      };
    }
  }

  async getOrderDetails(id: string) {
    try {
      const order = await this.orderModel.findById(id);
      if (!order) {
        return { success: false, message: 'Order not found' };
      }

      return { success: true, data: order };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error occurred while fetching order details',
      };
    }
  }
}