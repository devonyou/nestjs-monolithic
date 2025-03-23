import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

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
        toPlainOnly: true, // 응답시
        // toClassOnly:true // 요청시
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
}
