import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
    admin,
    user,
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.user })
    role: Role;

    @Column()
    username: string;

    @Column()
    profile: string;
}
