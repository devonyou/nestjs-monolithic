import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/common/entities/product.entity';
import { PagingModule } from 'src/paging/paging.module';

@Module({
    imports: [TypeOrmModule.forFeature([Product]), PagingModule],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
