import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feature } from 'src/models/feature.schema';

@Injectable()
export class FeatureService {
    constructor(
        @InjectModel('Feature') private readonly featureModel: Model<Feature>,
    ) { }

    async addFeatureImage(image: string, altText?: string): Promise<Feature> {
        const featureImage = new this.featureModel({ image, altText });
        return await featureImage.save();
    }

    async getFeatureImages(): Promise<Feature[]> {
        return await this.featureModel.find().exec();
    }
    
    async deleteFeatureImage(id: string): Promise<Feature> {
        const deletedFeature = await this.featureModel.findByIdAndDelete(id).exec();
        if (!deletedFeature) {
            throw new Error(`Feature with id ${id} not found`);
        }
        return deletedFeature;
    }
}