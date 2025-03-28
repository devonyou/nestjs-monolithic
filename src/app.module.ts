import { Module } from '@nestjs/common';
import { ConditionalModule, ConfigModule, ConfigService } from '@nestjs/config';
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
import { ProductModule } from './product/product.module';
import { Product } from './common/entities/product.entity';
import { Address } from './common/entities/address.entity';
import { AddressModule } from './address/address.module';
import { MappingModule } from './mapping/mapping.module';
import { Mapping } from './common/entities/mapping.entity';
import { OrderModule } from './order/order.module';
import { Order } from './common/entities/order.entity';
import { OrderProduct } from './common/entities/order.product';
import { OrderAddress } from './common/entities/order.address';
import { PagingModule } from './paging/paging.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AwsModule } from './aws/aws.module';
import { WorkerModule } from './worker/worker.module';
import { BullModule } from '@nestjs/bullmq';

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
                entities: [User, Product, Address, Mapping, Order, OrderProduct, OrderAddress],
                synchronize: configService.get<string>('ENV') === 'dev' ? true : false,
                ...(configService.get<string>('ENV') === 'prod' && {
                    ssl: {
                        rejectUnauthorized: false,
                    },
                }),
                logging: configService.get<string>('ENV') === 'dev' ? true : false,
            }),
        }),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                config: {
                    host: configService.getOrThrow('REDIS_HOST'),
                    port: configService.getOrThrow('REDIS_PORT'),
                },
            }),
            inject: [ConfigService],
        }),

        BullModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                connection: {
                    host: configService.get<string>('REDIS_HOST'),
                    port: configService.get<number>('REDIS_PORT'),
                },
            }),
            inject: [ConfigService],
        }),

        ConditionalModule.registerWhen(WorkerModule, (env: NodeJS.ProcessEnv) => env['TYPE'] === 'worker'),

        UserModule,
        AuthModule,
        ProductModule,
        AddressModule,
        MappingModule,
        OrderModule,
        PagingModule,
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
