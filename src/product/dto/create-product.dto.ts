import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    productName: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsOptional()
    thumbnail?: string;
}
