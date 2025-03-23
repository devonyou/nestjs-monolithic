import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Like, Repository } from 'typeorm';
import { Product } from 'src/common/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAllProductDto } from './dto/find-all-product.dto';

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {}

    async create(createProductDto: CreateProductDto) {
        const product = await this.productRepository.save(createProductDto);
        return this.findOne(product.id);
    }

    findAll(dto: FindAllProductDto) {
        const { productName } = dto;
        return this.productRepository.find({
            where: {
                ...(productName ? { productName: Like(`%${productName}%`) } : {}),
            },
        });
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
