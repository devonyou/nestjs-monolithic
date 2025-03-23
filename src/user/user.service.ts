import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
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

    async update(userId: number, dto: UpdateUserDto) {
        const { password, ...restDto } = dto;

        let hashedPassword;
        if (password) {
            const hashRounds = this.configService.get<number>('HASH_ROUNDS');
            hashedPassword = await bcrypt.hash(password, +hashRounds);
        }

        await this.userRepository.update(userId, {
            ...restDto,
            ...(password ? { password: hashedPassword } : {}),
        });

        return this.userRepository.findOneBy({ id: userId });
    }

    remove(userId: number) {
        return this.userRepository.delete(userId);
    }
}
