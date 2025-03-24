import { BadRequestException, Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { CursorPaginationDto } from './dto/cursor-pagination.dto';

@Injectable()
export class PagingService {
    constructor() {}

    async applyCursorPagination<T>(qb: SelectQueryBuilder<T>, dto: CursorPaginationDto) {
        const { cursor, take } = dto;
        let { order } = dto;

        if (cursor) {
            const decodedCursor = Buffer.from(cursor, 'base64').toString('utf-8');
            const cursorObj = JSON.parse(decodedCursor);
            order = cursorObj.order;

            const { values } = cursorObj;
            const columns = Object.keys(values);
            const operator = order.some(o => o.endsWith('DESC')) ? '<' : '>';
            const whereConditions = columns.map(c => `${qb.alias}.${c}`).join(',');
            const whereParams = columns.map(c => `:${c}`).join(',');
            qb.where(`(${whereConditions}) ${operator} (${whereParams})`, values);
        }

        for (let i = 0; i < order.length; i++) {
            const [column, direction] = order[i].split('_');
            if (direction !== 'ASC' && direction !== 'DESC') {
                throw new BadRequestException('order exception');
            }
            if (i === 0) qb.orderBy(`${qb.alias}.${column}`, direction);
            else qb.addOrderBy(`${qb.alias}.${column}`, direction);
        }

        qb.take(take);

        const results = await qb.getMany();

        const nextCursor = this.generateNextCursor(results, order);
        return { qb, nextCursor };
    }

    generateNextCursor<T>(results: T[], order: string[]): string | null {
        if (results.length === 0) return null;
        /**
         * values: {
         *  id:27
         * }
         * order:['id_DESC]
         */
        const lastItem = results[results.length - 1];
        const values = {};
        order.forEach(columnOrder => {
            const [column] = columnOrder.split('_');
            values[column] = lastItem[column];
        });
        const cursorObj = { values, order };
        const nextCursor = Buffer.from(JSON.stringify(cursorObj)).toString('base64');
        return nextCursor;
    }
}
