import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    pincode: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    notes: string;
}
