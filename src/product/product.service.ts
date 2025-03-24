import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Like, Repository } from 'typeorm';
import { Product } from 'src/common/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAllProductDto } from './dto/find-all-product.dto';
import { PagingService } from 'src/paging/paging.service';
import { executionAsyncResource } from 'async_hooks';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        private readonly pagingService: PagingService,
    ) {}

    async create(createProductDto: CreateProductDto) {
        const product = await this.productRepository.save(createProductDto);
        return this.findOne(product.id);
    }

    async findAll(dto: FindAllProductDto) {
        const { productName } = dto;
        // return this.productRepository.find({
        //     where: {
        //         ...(productName ? { productName: Like(`%${productName}%`) } : {}),
        //     },
        // });
        const qb = this.productRepository
            .createQueryBuilder()
            .where(productName ? { productName: Like(`%${productName}%`) } : {});

        const { nextCursor } = await this.pagingService.applyCursorPagination(qb, dto);

        const [data, count] = await qb.getManyAndCount();
        return {
            data,
            count,
            nextCursor,
        };
    }

    findOne(id: number) {
        return this.productRepository.findOneBy({ id });
    }

    async update(id: number, dto: UpdateProductDto) {
        await this.productRepository.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number) {
        const result = await this.productRepository.delete(id);
        return { success: result.affected };
    }
}
