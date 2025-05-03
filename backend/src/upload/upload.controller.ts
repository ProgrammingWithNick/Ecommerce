import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Res,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { UploadService } from './upload.service';
  
  @Controller('upload')
  export class UploadController {
    constructor(private readonly uploadService: UploadService) {}
  
    @Post('upload-image')
    @UseInterceptors(FileInterceptor('my_file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
      try {
        if (!file) {
          return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
  
        const result = await this.uploadService.uploadImage(file);
        return res.json({ success: true, result });
      } catch (error) {
        console.error('Upload route error:', error);
        return res.status(500).json({ success: false, message: 'Image upload failed' });
      }
    }
  }
  