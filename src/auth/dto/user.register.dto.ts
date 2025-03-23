import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/common/entities/user.entity';

export class UserRegisterDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNumber()
    @IsOptional()
    role?: Role;

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    profile?: string;

    @IsNumber()
    @IsOptional()
    age?: number;
}
