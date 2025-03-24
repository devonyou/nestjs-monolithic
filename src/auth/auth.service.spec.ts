import { FindMappingDto } from './../mapping/dto/find-mapping.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { Role, User } from 'src/common/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserRegisterDto } from './dto/user.register.dto';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
};

const mockConfigService = {
    get: jest.fn(),
};

const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
    decode: jest.fn(),
};

describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: Repository<User>;
    let configService: ConfigService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: getRepositoryToken(User), useValue: mockUserRepository },
                { provide: ConfigService, useValue: mockConfigService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        configService = module.get<ConfigService>(ConfigService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('registerUser', () => {
        it('should register a new user', async () => {
            const userDto = { email: 'user@gmail.com', password: 'pass1234' };
            const hashRounds = 10;
            const hashedPassword = '******';
            const newUser = { id: 1, email: userDto.email, password: hashedPassword };
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);
            jest.spyOn(configService, 'get').mockReturnValue(hashRounds);
            jest.spyOn(bcrypt, 'hash').mockImplementation((password, hashRound) => hashedPassword);
            jest.spyOn(userRepository, 'save').mockResolvedValue(newUser as User);
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(newUser as User);

            const result = await authService.registerUser(userDto);
            expect(result).toEqual(newUser);
            expect(userRepository.findOneBy).toHaveBeenNthCalledWith(1, { email: userDto.email });
            expect(userRepository.save).toHaveBeenCalledWith({ ...userDto, password: hashedPassword });
            expect(configService.get).toHaveBeenCalledWith('HASH_ROUNDS');
            expect(bcrypt.hash).toHaveBeenCalledWith(userDto.password, hashRounds);
            expect(userRepository.findOneBy).toHaveBeenNthCalledWith(2, { id: newUser.id });
        });

        it('should throw a UnauthorizedException if user already exists', async () => {
            const userDto = { email: 'admin@gmail.com', password: 'pass1234' };
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userDto as User);

            const result = authService.registerUser(userDto);
            expect(result).rejects.toThrow(UnauthorizedException);
            expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: userDto.email });
            expect(userRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('parseBasicToken', () => {
        it('should parse a valid Basic Token', () => {
            const rawToken = 'Basic YWRtaW5AZ21haWwuY29tOnBhc3MxMjM0';
            const decode = { email: 'admin@gmail.com', password: 'pass1234' };

            const result = authService.parseBasicToken(rawToken);
            expect(result).toEqual(decode);
        });

        it('should throw an error for invalid token format', () => {
            const rawToken = 'InvalidTokenFormat';

            const result = () => authService.parseBasicToken(rawToken);
            expect(result).toThrow(UnauthorizedException);
        });

        it('should throw an error for invalid Basic token format', () => {
            const rawToken = 'Bearer InvalidTokenFormat';

            const result = () => authService.parseBasicToken(rawToken);
            expect(result).toThrow(UnauthorizedException);
        });

        it('should throw an error for invalid Basic token format', () => {
            const rawToken = 'basic a';

            const result = () => authService.parseBasicToken(rawToken);
            expect(result).toThrow(UnauthorizedException);
        });
    });

    describe('loginUser', () => {
        it('should loginUser a user with correct credentials', async () => {
            const rawToken = 'Basic YWRtaW5AZ21haWwuY29tOnBhc3MxMjM0';
            const user = { email: 'admin@gmail.com', password: '******' };
            const token = 'token';
            jest.spyOn(authService, 'parseBasicToken').mockReturnValue(user);
            jest.spyOn(authService, 'authenticate').mockResolvedValue(user as User);
            jest.spyOn(authService, 'issueToken').mockResolvedValue(token);

            const result = await authService.loginUser(rawToken);
            expect(result).toEqual({ accessToken: token, refreshToken: token });
        });
    });

    describe('authenticate', () => {
        it('should autehtnicate a user with correct credentials', async () => {
            const email = 'admin@gmail.com';
            const password = 'pass1234';
            const hashedPassword = '******';
            const user = { email, password: hashedPassword };
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user as User);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

            const result = await authService.authenticate(email, password);
            expect(result).toEqual(user);
            expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
        });

        it('should throw an UnauthorizedException for not exisiting user', async () => {
            const email = 'admin@gmail.com';
            const password = 'pass1234';
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

            const result = authService.authenticate(email, password);
            expect(result).rejects.toThrow(UnauthorizedException);
        });

        it('should throw an error for incorrect password', async () => {
            const email = 'admin@gmail.com';
            const password = 'pass1234';
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({ email, password } as User);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

            const result = authService.authenticate(email, password);
            expect(result).rejects.toThrow(UnauthorizedException);
            expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
        });
    });

    describe('issueToken', () => {
        const user = { id: 1, role: Role.user };
        const token = 'token';
        const secretKey = 'secret';

        beforeEach(() => {
            jest.spyOn(mockConfigService, 'get').mockReturnValue(secretKey);
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);
        });

        it('should issue an access token', async () => {
            const result = await authService.issueToken(user as User, false);

            expect(jwtService.signAsync).toHaveBeenCalledWith(
                { sub: user.id, type: 'access', role: user.role },
                { secret: secretKey, expiresIn: '2h' },
            );
            expect(result).toBe(token);
        });

        it('should issue an refresh token', async () => {
            const result = await authService.issueToken(user as User, true);

            expect(jwtService.signAsync).toHaveBeenCalledWith(
                { sub: user.id, type: 'refresh', role: user.role },
                { secret: secretKey, expiresIn: '24h' },
            );
            expect(result).toBe(token);
        });
    });
});
