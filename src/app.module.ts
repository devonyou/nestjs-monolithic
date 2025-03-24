import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ConfigValidationSchema from 'src/common/config/config.validation.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessGuard } from './auth/guard/access.guard';
import { User } from './common/entities/user.entity';
import { RBACGuard } from './common/guard/rbac.guard';
import { ResponseTimeInterceptor } from './common/interceptor/response.time.interceptor';
import { ThrottleInterceptor } from './common/interceptor/throttle.interceptor';
import { RedisModule } from './redis/redis.module';
import { ProductModule } from './product/product.module';
import { Product } from './common/entities/product.entity';
import { Address } from './common/entities/address.entity';
import { AddressModule } from './address/address.module';
import { MappingModule } from './mapping/mapping.module';
import { Mapping } from './common/entities/mapping.entity';

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
                entities: [User, Product, Address, Mapping],
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
        RedisModule,
        ProductModule,
        AddressModule,
        MappingModule,
    ],
    controllers: [],
    providers: [
        { provide: APP_INTERCEPTOR, useClass: ResponseTimeInterceptor },
        { provide: APP_INTERCEPTOR, useClass: ThrottleInterceptor },
        { provide: APP_GUARD, useClass: AccessGuard },
        { provide: APP_GUARD, useClass: RBACGuard },
    ],
})
export class AppModule {}
