import { ResponseTimeInterceptor } from './../common/interceptor/response.time.interceptor';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from 'src/common/entities/user.entity';
import { RBAC } from 'src/common/decorator/rabc.decorator';
import { Authorization } from 'src/common/decorator/authorization.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import { UserRegisterDto } from './dto/user.register.dto';
import { ResponseTime } from 'src/common/decorator/response.time.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @RBAC(Role.admin)
    register(@Body() dto: UserRegisterDto) {
        return this.authService.registerUser(dto);
    }

    @Post('login')
    @Public()
    login(@Authorization() token: string) {
        return this.authService.loginUser(token);
    }

    @Post('test')
    @Public()
    async test() {
        return 1;
    }
}
