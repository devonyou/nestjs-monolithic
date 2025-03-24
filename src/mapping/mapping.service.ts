import { Injectable } from '@nestjs/common';
import { UpsertMappingDto } from './dto/upsert-mapping.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mapping } from 'src/common/entities/mapping.entity';
import { Repository } from 'typeorm';
import { FindMappingDto } from './dto/find-mapping.dto';

@Injectable()
export class MappingService {
    constructor(@InjectRepository(Mapping) private readonly mappingRepository: Repository<Mapping>) {}

    async upsert(dto: UpsertMappingDto) {
        const { userId, productId, price } = dto;
        await this.mappingRepository.upsert(
            {
                user: { id: userId },
                product: { id: productId },
                price: price,
            },
            ['user', 'product'],
        );
        return await this.findOne(dto);
    }

    findAll(dto: FindMappingDto) {
        return this.mappingRepository.find({
            where: {
                ...(dto.userId ? { user: { id: dto.userId } } : {}),
                ...(dto.productId ? { user: { id: dto.productId } } : {}),
            },
            relations: ['user', 'product'],
        });
    }

    findOne(dto: FindMappingDto) {
        return this.mappingRepository.findOne({
            where: {
                ...(dto.userId ? { user: { id: dto.userId } } : {}),
                ...(dto.productId ? { user: { id: dto.productId } } : {}),
            },
            relations: ['user', 'product'],
        });
    }

    async remove(id: number) {
        const result = await this.mappingRepository.delete({ id });
        return {
            success: result.affected,
        };
    }
}
