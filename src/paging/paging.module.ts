import { Module } from '@nestjs/common';
import { PagingService } from './paging.service';

@Module({
    providers: [PagingService],
    exports: [PagingService],
})
export class PagingModule {}
