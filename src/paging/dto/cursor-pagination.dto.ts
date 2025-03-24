import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CursorPaginationDto {
    @IsString()
    @IsOptional()
    cursor?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    order?: string[] = ['id_DESC']; // [id_ASC, id_DESC]

    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    take: number = 5;
}
