import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MappingService } from './mapping.service';
import { UpsertMappingDto } from './dto/upsert-mapping.dto';
import { RBAC } from 'src/common/decorator/rabc.decorator';
import { Role } from 'src/common/entities/user.entity';
import { FindMappingDto } from './dto/find-mapping.dto';

@Controller('mapping')
export class MappingController {
    constructor(private readonly mappingService: MappingService) {}

    @Post('upsert')
    @RBAC(Role.admin)
    upsert(@Body() dto: UpsertMappingDto) {
        return this.mappingService.upsert(dto);
    }

    @Get()
    @RBAC(Role.admin)
    findAll(@Body() dto: FindMappingDto) {
        return this.mappingService.findAll(dto);
    }

    @Delete(':id')
    @RBAC(Role.admin)
    remove(@Param('id') id: string) {
        return this.mappingService.remove(+id);
    }
}
