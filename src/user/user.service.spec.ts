import { QueryRunner, Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from 'src/common/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { TestBed } from '@automock/jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
    let userService: UserService;
    // let dataSource: jest.Mocked<DataSource>;
    let userRepository: jest.Mocked<Repository<User>>;
    let configService: jest.Mocked<ConfigService>;

    beforeEach(async () => {
        const { unit, unitRef } = TestBed.create(UserService).compile();
        userService = unit;
        // dataSource = unitRef.get(DataSource);
        userRepository = unitRef.get(getRepositoryToken(User) as string);
        configService = unitRef.get(ConfigService);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should find all user list by email', () => {
            const email = 'admin@gmail.com';
            const users = [{ email }, { email }];
            jest.spyOn(userRepository, 'find').mockResolvedValue(users as User[]);

            expect(userService.findAll({ email })).resolves.toEqual(users);
        });

        it('should find all user list', () => {
            const users = [{ id: 1 }, { id: 2 }];
            jest.spyOn(userRepository, 'find').mockResolvedValue(users as User[]);

            expect(userService.findAll({ email: null })).resolves.toEqual(users);
        });
    });

    describe('findOne', () => {
        it('should find a user by userId', () => {
            const userId = 1;
            const user = { id: userId, email: 'admin@gmail.com' };
            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user as User);

            expect(userService.findOne(userId)).resolves.toEqual(user);
        });
    });

    describe('update', () => {
        let qr: jest.Mocked<QueryRunner>;
        let updateUserMock: jest.SpyInstance;
        let findOneByMock: jest.SpyInstance;
        let mockUserRepo: jest.Mocked<Repository<User>>;

        beforeEach(() => {
            const user = { id: 1, email: 'admin@gmail.com', password: 'pass1234' } as User;

            // Repository Mock 생성
            mockUserRepo = {
                update: jest.fn(),
                findOneBy: jest.fn(), // `spyOn`을 적용할 대상
            } as any as jest.Mocked<Repository<User>>;

            // QueryRunner의 manager.getRepository() Mock
            qr = {
                manager: {
                    getRepository: jest.fn().mockReturnValue(mockUserRepo), // userRepo를 반환하도록 설정
                },
            } as any as jest.Mocked<QueryRunner>;

            // `findOneBy`를 `spyOn`으로 감시하고 특정 값을 반환하도록 설정
            findOneByMock = jest.spyOn(mockUserRepo, 'findOneBy').mockResolvedValue(user);

            // userService의 updateUser를 감시
            updateUserMock = jest.spyOn(userService, 'updateUser');
        });

        it('should update a user', async () => {
            const password = 'pass1234';
            const hashedPassword = '******';
            const hashRounds = 10;
            const user = { id: 1, email: 'admin@gmail.com', password: password };

            jest.spyOn(configService, 'get').mockReturnValue(hashRounds);
            jest.spyOn(bcrypt, 'hash').mockImplementation(() => hashedPassword);

            const result = await userService.update(user.id, user, qr);

            expect(findOneByMock).toHaveBeenCalledWith({ id: user.id });

            expect(result).toEqual(user as User);
        });
    });

    describe('remove', () => {
        it('should remove user', async () => {
            const userId = 1;
            const affected = 1;
            jest.spyOn(userRepository, 'delete').mockResolvedValue({ affected } as any);

            const result = await userService.remove(userId);
            expect(result).toEqual({ success: affected });
        });
    });
});
