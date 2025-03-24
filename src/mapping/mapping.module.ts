import { Module } from '@nestjs/common';
import { MappingService } from './mapping.service';
import { MappingController } from './mapping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mapping } from 'src/common/entities/mapping.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Mapping])],
    controllers: [MappingController],
    providers: [MappingService],
})
export class MappingModule {}
