import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFeatureDto {
    @IsNotEmpty()
    @IsString()
    image: string;

    @IsOptional()
    @IsString()
    altText?: string;
}
