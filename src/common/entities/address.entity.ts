import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Address extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    addressName: string;

    @Column()
    postCode: string;

    @Column()
    address1: string;

    @Column()
    address2: string;

    @ManyToOne(() => User, user => user.addresses)
    user: User;
}
