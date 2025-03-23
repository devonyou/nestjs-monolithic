import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UserId } from 'src/common/decorator/user.id.decorator';

@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @Post()
    create(@UserId() userId: number, @Body() createAddressDto: CreateAddressDto) {
        return this.addressService.create(userId, createAddressDto);
    }

    @Get()
    findAll(@UserId() userId: number) {
        return this.addressService.findAll(userId);
    }

    @Get(':id')
    findOne(@UserId() userId: number, @Param('id') id: string) {
        return this.addressService.findOne(userId, +id);
    }

    @Patch(':id')
    update(@UserId() userId: number, @Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
        return this.addressService.update(userId, +id, updateAddressDto);
    }

    @Delete(':id')
    remove(@UserId() userId: number, @Param('id') id: string) {
        return this.addressService.remove(userId, +id);
    }
}
