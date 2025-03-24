import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/common/entities/order.entity';
import { OrderProduct } from 'src/common/entities/order.product';
import { OrderAddress } from 'src/common/entities/order.address';
import { Product } from 'src/common/entities/product.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderProduct) private readonly orderProductRepository: Repository<OrderProduct>,
        @InjectRepository(OrderAddress) private readonly orderAddressRepository: Repository<OrderAddress>,
    ) {}

    async create(userId: number, dto: CreateOrderDto, qr: QueryRunner) {
        const productIds = [...dto.products.map(({ productId }) => productId)];

        const products = await qr.manager
            .getRepository(Product)
            .createQueryBuilder('p')
            .leftJoin('p.mappings', 'm', 'm.userId = :userId', { userId })
            .select(['p.id AS productId', 'p.productName AS productName', 'IFNULL(m.price, p.price) AS price'])
            .where('p.id IN (:productIds)', { productIds: productIds })
            .andWhere('IFNULL(m.hidden, p.hidden) <> TRUE')
            .getRawMany();

        if (productIds.length !== products.length) {
            throw new BadRequestException();
        }

        const amount = products.reduce((acc, next) => {
            const qty = dto.products.find(p => p.productId === next.productId).quantity;
            return (acc += qty * next.price);
        }, 0);

        const order = await qr.manager
            .getRepository(Order)
            .createQueryBuilder()
            .insert()
            .into(Order)
            .values({
                user: { id: userId },
                amount,
                orderAddress: dto.address,
            })
            .execute();

        const orderId = order.identifiers[0].id;

        const orderProductData = dto.products.map(p => ({
            order: { id: orderId },
            quantity: p.quantity,
            product: { id: p.productId },
            price: products.find(product => product.productId === p.productId).price,
        }));

        await qr.manager
            .getRepository(OrderProduct)
            .createQueryBuilder()
            .insert()
            .into(OrderProduct)
            .values(orderProductData)
            .execute();

        await qr.manager.getRepository(OrderAddress).insert({
            ...dto.address,
            order: { id: orderId },
        });

        return qr.manager.getRepository(Order).findOne({
            where: { id: orderId },
        });
    }

    findOne(id: number) {
        return this.orderRepository.findOne({
            where: {
                id: id,
            },
            relations: ['orderProducts', 'orderAddress', 'user'],
        });
    }
}
