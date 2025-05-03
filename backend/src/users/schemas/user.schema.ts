// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from 'src/common/enums/user-role.enum';

// Updated UserDocument type
export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    // Explicitly define _id property
    _id: Types.ObjectId;

    @Prop({ required: true })
    userName: string;

    @Prop({ required: true, unique: true, lowercase: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ enum: UserRole, default: UserRole.USER })
    role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);