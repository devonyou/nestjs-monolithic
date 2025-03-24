import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Mapping } from './mapping.entity';
import { OrderProduct } from './order.product';

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productName: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    price: number;

    @Column({ default: false })
    hidden: boolean;

    @OneToMany(() => Mapping, mapping => mapping.product)
    mappings: Mapping[];

    @OneToMany(() => OrderProduct, orderProduct => orderProduct.product)
    orderProducts: OrderProduct[];

    @Column({ nullable: true })
    thumbnail?: string;
}
