import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.orderProducts, { nullable: false })
    order: Order;

    @ManyToOne(() => Product, product => product.orderProducts, { nullable: false })
    product: Product;

    @Column()
    quantity: number;

    @Column()
    price: number;
}
