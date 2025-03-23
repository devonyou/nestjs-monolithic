import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from './dto/user.register.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async registerUser(dto: UserRegisterDto) {
        const { email, password } = dto;

        const existsUser = await this.userRepository.findOneBy({ email });
        if (existsUser) throw new UnauthorizedException('already user email');

        const hashRounds = this.configService.get<number>('HASH_ROUNDS');
        const hashedPassword = await bcrypt.hash(password, +hashRounds);
        const newUser = await this.userRepository.save({
            ...dto,
            password: hashedPassword,
        });

        return this.userRepository.findOneBy({ id: newUser.id });
    }

    private parseBasicToken(rawToken: string) {
        const [prefix, token] = rawToken.split(' ');

        if (!prefix || !token) throw new UnauthorizedException();
        if (prefix.toLocaleLowerCase() !== 'basic') throw new UnauthorizedException();

        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [email, password] = decoded.split(':');

        if (!email || !password) throw new UnauthorizedException();

        return {
            email,
            password,
        };
    }

    async loginUser(token: string) {
        const { email, password } = this.parseBasicToken(token);
        const user = await this.authenticate(email, password);

        return {
            accessToken: await this.issueToken(user, false),
            refreshToken: await this.issueToken(user, true),
        };
    }

    private async authenticate(email, password) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new UnauthorizedException('bad user data');

        const comparedPassword = await bcrypt.compare(password, user.password);
        if (!comparedPassword) throw new UnauthorizedException('bad user data');

        return user;
    }

    private async issueToken(user: User, isRefreshToken: boolean) {
        const ACCESS_TOKEN_SECRET = this.configService.get('ACCESS_TOKEN_SECRET');
        const REFRESH_TOKEN_SECRET = this.configService.get('REFRESH_TOKEN_SECRET');
        return await this.jwtService.signAsync(
            {
                sub: user.id,
                role: user.role,
                type: isRefreshToken ? 'refresh' : 'access',
            },
            {
                secret: isRefreshToken ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET,
                expiresIn: isRefreshToken ? '24h' : '2h',
            },
        );
    }
}
