import { Inject, Injectable } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(@Inject('CLOUDINARY') private cloudinary: typeof Cloudinary) {}

  async uploadImage(file: Express.Multer.File) {
    const base64Image = file.buffer.toString('base64');
    const result = await this.cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${base64Image}`,
      { folder: 'ecommerce' }
    );
    return result.secure_url;
  }
}
