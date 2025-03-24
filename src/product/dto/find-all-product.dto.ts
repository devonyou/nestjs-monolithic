import { IsOptional, IsString } from 'class-validator';
import { CursorPaginationDto } from 'src/paging/dto/cursor-pagination.dto';

export class FindAllProductDto extends CursorPaginationDto {
    @IsString()
    @IsOptional()
    productName?: string;
}
