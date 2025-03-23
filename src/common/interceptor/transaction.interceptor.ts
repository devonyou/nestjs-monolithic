import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, concatMap, finalize, Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(private readonly datasource: DataSource) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        const queryRunner = this.datasource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        request.queryRunner = queryRunner;

        return next.handle().pipe(
            concatMap(async res => {
                await queryRunner.commitTransaction();
                return res;
            }),
            catchError(async err => {
                await queryRunner.rollbackTransaction();
                throw err;
            }),
            finalize(async () => {
                await queryRunner.release();
            }),
        );
    }
}
