import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { OrderProduct } from './order.product';
import { OrderAddress } from './order.address';

@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @OneToMany(() => OrderProduct, orderProduct => orderProduct.order, { cascade: true, nullable: false })
    orderProducts: OrderProduct[];

    @OneToOne(() => OrderAddress, orderAddress => orderAddress.order, { cascade: true, nullable: false })
    orderAddress: OrderAddress;

    @Column()
    amount: number;
}
