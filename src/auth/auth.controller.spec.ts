import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/common/entities/user.entity';

const mockAuthService = {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
};

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{ provide: AuthService, useValue: mockAuthService }],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('register', () => {
        it('should register a user', async () => {
            const user = { id: 1, email: 'user@gmail.com' };
            jest.spyOn(authService, 'registerUser').mockResolvedValue(user as User);

            const result = await authController.register(user as User);
            expect(result).toEqual(user as User);
            expect(authService.registerUser).toHaveBeenCalledWith(user as User);
        });
    });

    describe('login', () => {
        it('should login a user', async () => {
            const basicToken = 'Basic YWRtaW5AZ21haWwuY29tOnBhc3MxMjM0';
            const bearerTokens = { refreshToken: 'token', accessToken: 'token' };
            jest.spyOn(authService, 'loginUser').mockResolvedValue(bearerTokens);

            const result = await authController.login(basicToken);
            expect(result).toEqual(bearerTokens);
            expect(authService.loginUser).toHaveBeenCalledWith(basicToken);
        });
    });
});
