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

    /* istanbul ignore next */
    async updateUser(userId: number, dto: UpdateUserDto, qr: QueryRunner) {
        await qr.manager.getRepository(User).update(userId, dto);
    }

    async update(userId: number, dto: UpdateUserDto, qr: QueryRunner) {
        const { password, ...restDto } = dto;

        let hashedPassword;
        if (password) {
            const hashRounds = this.configService.get<number>('HASH_ROUNDS');
            hashedPassword = await bcrypt.hash(password, +hashRounds);
        }

        const updateUser = {
            ...restDto,
            password,
            ...(password ? { password: hashedPassword } : {}),
        };

        await this.updateUser(userId, updateUser, qr);

        const user = await qr.manager.getRepository(User).findOneBy({ id: userId });
        return user;
    }

    async remove(userId: number) {
        const result = await this.userRepository.delete(userId);
        return { success: result.affected };
    }
}
