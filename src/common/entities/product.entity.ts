import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Mapping } from './mapping.entity';

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

    @OneToMany(() => Mapping, mapping => mapping.product)
    mappings: Mapping[];
}
