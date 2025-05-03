import {
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    Min,
} from 'class-validator';

export class AddToCartDto {
    @IsMongoId()
    userId: string;

    @IsMongoId()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class UpdateCartItemDto {
    @IsMongoId()
    userId: string;

    @IsMongoId()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}
