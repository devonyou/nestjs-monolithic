import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ConfigValidationSchema from 'src/common/config/config.validation.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './auth/guard/access.guard';
import { RBACGuard } from './auth/guard/rbac.guard';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: ConfigValidationSchema,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: configService.get<string>('DB_TYPE') as 'mysql',
                url: configService.get<string>('DB_URL'),
                entities: [],
                synchronize: configService.get<string>('ENV') === 'dev' ? true : false,
                ...(configService.get<string>('ENV') === 'prod' && {
                    ssl: {
                        rejectUnauthorized: false,
                    },
                }),
                logging: configService.get<string>('ENV') === 'dev' ? true : false,
            }),
        }),
        UserModule,
        AuthModule,
    ],
    controllers: [],
    providers: [
        { provide: APP_GUARD, useClass: AccessGuard },
        { provide: APP_GUARD, useClass: RBACGuard },
    ],
})
export class AppModule {}
