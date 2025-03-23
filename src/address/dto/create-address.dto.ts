import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDto {
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
