import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Address } from './address.entity';
import { Mapping } from './mapping.entity';
import { Order } from './order.entity';

export enum Role {
    admin = 0,
    user = 1,
    guest = 2,
}

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude({
        toPlainOnly: true,
        // toClassOnly:true
    })
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.user })
    role: Role;

    @Column({ nullable: true })
    username: string;

    @Column({ nullable: true })
    profile: string;

    @Column({ nullable: true })
    age: number;

    @OneToMany(() => Address, address => address.user)
    addresses: Address[];

    @OneToMany(() => Mapping, mapping => mapping.user)
    mappings: Mapping[];

    @OneToMany(() => Order, order => order.user)
    orders: Order[];
}
