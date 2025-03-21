import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessStrategy } from './stratgy/access.strategy';
import { AccessGuard } from './guard/access.guard';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [AuthService, AccessStrategy],
})
export class AuthModule {}
