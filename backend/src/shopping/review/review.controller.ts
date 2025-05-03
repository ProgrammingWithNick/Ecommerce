import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('shop/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async addReview(@Body() createReviewDto: CreateReviewDto) {
    const review = await this.reviewService.addProductReview(createReviewDto);
    return { success: true, data: review };
  }

  @Get(':productId')
  async getReviews(@Param('productId') productId: string) {
    const reviews = await this.reviewService.getProductReviews(productId);
    return { success: true, data: reviews };
  }

  @Put(':reviewId')
  async updateReview(
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: CreateReviewDto
  ) {
    const updatedReview = await this.reviewService.updateReview(reviewId, updateReviewDto);
    return { success: true, data: updatedReview };
  }

  @Delete(':reviewId')
  async deleteReview(@Param('reviewId') reviewId: string) {
    const deletedReview = await this.reviewService.deleteReview(reviewId);
    return { success: true, data: deletedReview };
  }
}
