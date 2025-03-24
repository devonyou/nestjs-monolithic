import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderAddress {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Order, order => order.orderAddress, { nullable: false })
    @JoinColumn()
    order: Order;

    @Column()
    addressName: string;

    @Column()
    postCode: string;

    @Column()
    address1: string;

    @Column()
    address2: string;
}
