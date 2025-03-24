import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpsertMappingDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}
