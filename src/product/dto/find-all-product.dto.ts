import { IsOptional, IsString } from 'class-validator';

export class FindAllProductDto {
    @IsString()
    @IsOptional()
    productName?: string;
}
