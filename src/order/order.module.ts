import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from 'src/common/entities/order.product';
import { OrderAddress } from 'src/common/entities/order.address';
import { Order } from 'src/common/entities/order.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderProduct, OrderAddress])],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
