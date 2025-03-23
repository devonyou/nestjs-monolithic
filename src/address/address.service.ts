import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from 'src/common/entities/address.entity';

@Injectable()
export class AddressService {
    constructor(@InjectRepository(Address) private readonly addressRepository: Repository<Address>) {}

    async create(userId: number, dto: CreateAddressDto) {
        const query = this.addressRepository
            .createQueryBuilder()
            .insert()
            .values({
                ...dto,
                user: {
                    id: userId,
                },
            });
        const result = await query.execute();
        return await this.findOne(userId, result.identifiers[0].id);
    }

    findAll(userId: number) {
        return this.addressRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
        });
    }

    findOne(userId: number, id: number) {
        return this.addressRepository
            .createQueryBuilder('address')
            .leftJoinAndSelect('address.user', 'user')
            .where({ user: { id: userId } })
            .andWhere({ id: id })
            .getOne();
    }

    async update(userId: number, id: number, updateAddressDto: UpdateAddressDto) {
        await this.addressRepository.update({ id, user: { id: userId } }, updateAddressDto);
        return this.findOne(userId, id);
    }

    async remove(userId: number, id: number) {
        const result = await this.addressRepository.delete({ id, user: { id: userId } });
        return { success: result.affected };
    }
}
