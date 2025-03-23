import { Reflector } from '@nestjs/core';
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, timeout } from 'rxjs';
import { ResponseTime } from '../decorator/response.time.decorator';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const limit = this.reflector.get<number>(ResponseTime, context.getHandler()) ?? 5000;

        return next.handle().pipe(
            timeout(limit),
            catchError(err => {
                console.log(err);
                throw new InternalServerErrorException('timeout response');
            }),
        );
    }
}
