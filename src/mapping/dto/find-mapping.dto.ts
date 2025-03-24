import { IsNumber, IsOptional } from 'class-validator';

export class FindMappingDto {
    @IsNumber()
    @IsOptional()
    userId: number;

    @IsNumber()
    @IsOptional()
    productId: number;
}
