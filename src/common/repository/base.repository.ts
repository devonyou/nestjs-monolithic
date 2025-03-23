import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { EntityManager, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class BaseRepository {
    constructor(private readonly request: Request) {}

    protected getRepository<T>(entityCls: new () => T): Repository<T> {
        const entityManager: EntityManager = (this.request['queryRunner'] as QueryRunner).manager;
        return entityManager.getRepository(entityCls);
    }
}
