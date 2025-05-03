import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({
    timestamps: { createdAt: 'orderDate', updatedAt: 'orderUpdateDate' },
})
export class Order {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    cartId: string;

    @Prop([
        {
            productId: { type: String, required: true },
            title: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: String, required: true },
            quantity: { type: Number, required: true },
        },
    ])
    cartItems: {
        productId: string;
        title: string;
        image: string;
        price: string;
        quantity: number;
    }[];

    @Prop({
        type: {
            addressId: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: String, required: true },
            phone: { type: String, required: true },
            notes: { type: String },
        },
        required: true,
    })
    addressInfo: {
        addressId: string;
        address: string;
        city: string;
        pincode: string;
        phone: string;
        notes?: string;
    };

    @Prop({ required: true })
    orderStatus: string;

    @Prop({ required: true })
    paymentMethod: string;

    @Prop({ required: true })
    paymentStatus: string;

    @Prop({ required: true })
    totalAmount: number;

    @Prop()
    paymentId?: string;

    @Prop()
    payerId?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
