import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { ProductsModule as AdminProductsModule } from './admin/products/products.module';
import { ProductsModule as ShoppingProductsModule } from './shopping/products.module';
import { OrderModule } from './admin/order/order.module';
import { FeatureModule } from './admin/feature/feature.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UploadModule,
    AdminProductsModule,
    ShoppingProductsModule,
    OrderModule,
    FeatureModule, // ✅ Now it's clear which is which
  ],

  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule { }
