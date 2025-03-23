import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, QueryRunner, Repository } from 'typeorm';
import { User } from 'src/common/entities/user.entity';
import { FindUsersDto } from './dto/find-users.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) {}

    findAll(dto: FindUsersDto) {
        const { email } = dto;
        return this.userRepository.find({
            where: {
                ...(email ? { email: Like(`%${email}%`) } : {}),
            },
        });
    }

    findOne(userId: number) {
        return this.userRepository.findOneBy({ id: userId });
    }

    async update(userId: number, dto: UpdateUserDto, qr: QueryRunner) {
        const { password, ...restDto } = dto;

        let hashedPassword;
        if (password) {
            const hashRounds = this.configService.get<number>('HASH_ROUNDS');
            hashedPassword = await bcrypt.hash(password, +hashRounds);
        }

        await qr.manager.getRepository(User).update(userId, {
            ...restDto,
            ...(password ? { password: hashedPassword } : {}),
        });

        return await qr.manager.getRepository(User).findOneBy({ id: userId });
    }

    async remove(userId: number) {
        const result = await this.userRepository.delete(userId);
        return { success: result.affected };
    }
}
