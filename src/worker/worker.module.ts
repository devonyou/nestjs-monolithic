import { Module } from '@nestjs/common';
import { ProductThumbnailWorker } from './prdouct.thumbnail.worker';

@Module({
    providers: [ProductThumbnailWorker],
})
export class WorkerModule {}
