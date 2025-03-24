import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class CreateOrderProduct {
    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}

class CreateOrderAddress {
    @IsString()
    @IsNotEmpty()
    addressName: string;

    @IsString()
    @IsNotEmpty()
    postCode: string;

    @IsString()
    @IsNotEmpty()
    address1: string;

    @IsString()
    @IsNotEmpty()
    address2: string;
}

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderProduct)
    @ArrayNotEmpty()
    products: CreateOrderProduct[];

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateOrderAddress)
    address: CreateOrderAddress;
}
