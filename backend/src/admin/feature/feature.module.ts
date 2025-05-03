import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeatureSchema } from 'src/models/feature.schema';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Feature', schema: FeatureSchema }])],
  controllers: [FeatureController],
  providers: [FeatureService],
})
export class FeatureModule {}
