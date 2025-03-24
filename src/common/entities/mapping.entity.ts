import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
@Unique(['user', 'product'])
export class Mapping {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @ManyToOne(() => User, user => user.mappings, { nullable: false })
    user: User;

    @ManyToOne(() => Product, product => product.mappings, { nullable: false })
    product: Product;
}
