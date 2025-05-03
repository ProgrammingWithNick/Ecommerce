import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
    @Prop({ required: true })
    productId: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    userName: string;

    @Prop({ required: true })
    reviewMessage: string;

    @Prop({ required: true })
    reviewValue: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
