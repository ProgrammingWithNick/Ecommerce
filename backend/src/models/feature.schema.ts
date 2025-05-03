import { Schema, Document } from 'mongoose';

export const FeatureSchema = new Schema(
    {
        image: { type: String, required: true },
        altText: { type: String }, // <-- Add this line
    },
    { timestamps: true }
);

export interface Feature extends Document {
    id: string;
    image: string;
    altText?: string;
}
