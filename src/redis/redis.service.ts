import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly redisClient: Redis;
    private readonly logger = new Logger(RedisService.name);

    constructor(private readonly configService: ConfigService) {
        const redisHost = configService.get<string>('REDIS_HOST');
        const redisPort = configService.get<number>('REDIS_PORT');

        this.redisClient = new Redis(redisPort, redisHost);

        this.redisClient.on('error', err => {
            this.logger.error(`🆘 Error while connecting to Redis`);
        });
        this.redisClient.on('connect', () => {
            this.logger.log(`✅ Successfully connected to Redis`);
        });
    }

    getRedisClient() {
        return this.redisClient;
    }
}
