import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from 'src/common/entities/user.entity';
import { RBAC } from 'src/common/decorator/rabc.decorator';
import { UserId } from 'src/common/decorator/user.id.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @RBAC(Role.admin)
    register(@UserId() userId: number) {
        return userId;
    }
}
