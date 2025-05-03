import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from 'src/models/review.schema';
import { Order } from 'src/models/order.schema';
import { Product } from 'src/models/product.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async addProductReview(createReviewDto: CreateReviewDto) {
    const { productId, userId, userName, reviewMessage, reviewValue } = createReviewDto;

    const order = await this.orderModel.findOne({
      userId,
      'cartItems.productId': productId,
    });

    if (!order) {
      throw new ForbiddenException('You need to purchase product to review it.');
    }

    const existingReview = await this.reviewModel.findOne({ productId, userId });
    if (existingReview) {
      throw new BadRequestException('You already reviewed this product!');
    }

    const newReview = await this.reviewModel.create({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await this.updateProductAverageReview(productId);

    return newReview;
  }

  async getProductReviews(productId: string) {
    const reviews = await this.reviewModel.find({ productId });
    return reviews;
  }

  async updateReview(reviewId: string, updateReviewDto: CreateReviewDto) {
    const { productId, userId, reviewMessage, reviewValue } = updateReviewDto;
    
    const review = await this.reviewModel.findOne({ _id: reviewId, userId });

    if (!review) {
      throw new BadRequestException('Review not found or you do not have permission to update it.');
    }

    review.reviewMessage = reviewMessage;
    review.reviewValue = reviewValue;
    await review.save();

    await this.updateProductAverageReview(productId);

    return review;
  }

  async deleteReview(reviewId: string) {
    const review = await this.reviewModel.findById(reviewId);
    
    if (!review) {
      throw new BadRequestException('Review not found.');
    }

    const productId = review.productId;
    
    await this.reviewModel.findByIdAndDelete(reviewId);
    await this.updateProductAverageReview(productId);

    return review;
  }

  private async updateProductAverageReview(productId: string) {
    const reviews = await this.reviewModel.find({ productId });
    const totalReviews = reviews.length;
    
    if (totalReviews > 0) {
      const averageReview = reviews.reduce((sum, r) => sum + r.reviewValue, 0) / totalReviews;
      await this.productModel.findByIdAndUpdate(productId, { averageReview });
    } else {
      await this.productModel.findByIdAndUpdate(productId, { averageReview: 0 });
    }
  }
}