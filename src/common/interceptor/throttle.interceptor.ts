import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import Redis from 'ioredis';
import { Observable } from 'rxjs';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ThrottleInterceptor implements NestInterceptor {
    private redisClient: Redis;

    constructor(private readonly redisService: RedisService) {
        this.redisClient = redisService.getRedisClient();
    }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest() as Request;
        const ip = req.ip;
        const minute = new Date().getMinutes();
        const key = `${req.method}_${req.path}_${ip}_${minute}`;
        const limit = 5;
        const ttl = 60;

        const count = +(await this.redisClient.get(key)) || 1;

        if (count >= limit) {
            throw new ForbiddenException('Too many requests, please try again later.');
        }

        if (count === 1) {
            await this.redisClient.setex(key, ttl, 1);
        } else {
            await this.redisClient.incr(key);
        }

        return next.handle();
    }
}
