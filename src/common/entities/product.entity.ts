import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

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

    @Column({ default: 10 })
    stock: number;
}
