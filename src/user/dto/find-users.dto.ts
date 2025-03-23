import { IsOptional, IsString } from 'class-validator';

export class FindUsersDto {
    @IsString()
    @IsOptional()
    email?: string;
}
