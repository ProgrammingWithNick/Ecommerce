import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AddressDocument = Address & Document;

@Schema({ timestamps: true })
export class Address {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    pincode: string;

    @Prop({ required: true })
    phone: string;

    @Prop()
    notes: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
