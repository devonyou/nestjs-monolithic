import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/common/entities/product.entity';
import { PagingModule } from 'src/paging/paging.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),

        BullModule.registerQueue({
            name: 'product-thumbnail',
        }),

        PagingModule,
    ],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
