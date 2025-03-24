import { Controller, Get, Post, Body, Param, UseInterceptors, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Role } from 'src/common/entities/user.entity';
import { RBAC } from 'src/common/decorator/rabc.decorator';
import { UserId } from 'src/common/decorator/user.id.decorator';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    @RBAC(Role.user)
    @UseInterceptors(TransactionInterceptor)
    create(@UserId() userId: number, @Body() createOrderDto: CreateOrderDto, @Req() req) {
        return this.orderService.create(userId, createOrderDto, req.queryRunner);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orderService.findOne(+id);
    }
}
