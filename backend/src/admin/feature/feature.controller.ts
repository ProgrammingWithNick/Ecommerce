import { Controller, Post, Get, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { CreateFeatureDto } from './dto/create-feature.dto';

@Controller('admin/feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post('add')
  async addFeatureImage(@Body() body: CreateFeatureDto) {
    try {
      const featureImage = await this.featureService.addFeatureImage(body.image, body.altText);
      return {
        success: true,
        data: featureImage,
      };
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          message: 'Some error occurred!',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('all')
  async getFeatureImages() {
    try {
      const images = await this.featureService.getFeatureImages();
      return {
        success: true,
        data: images,
      };
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          message: 'Some error occurred!',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteFeatureImage(@Param('id') id: string) {
    try {
      const deletedImage = await this.featureService.deleteFeatureImage(id);
      if (!deletedImage) {
        throw new HttpException(
          {
            success: false,
            message: 'Image not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        data: deletedImage,
      };
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          message: e.response?.message || 'Some error occurred!',
        },
        e.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}