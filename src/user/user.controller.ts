import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RBAC } from 'src/common/decorator/rabc.decorator';
import { Role } from 'src/common/entities/user.entity';
import { FindUsersDto } from './dto/find-users.dto';
import { UserId } from 'src/common/decorator/user.id.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @RBAC(Role.admin)
    findAll(@Body() body: FindUsersDto) {
        return this.userService.findAll(body);
    }

    @Get(':id')
    @RBAC(Role.admin)
    findOne(@Param('id') id: string) {
        return this.userService.findOne(+id);
    }

    @Patch()
    @RBAC(Role.user)
    update(@UserId() userId: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(userId, updateUserDto);
    }

    @Delete(':id')
    @RBAC(Role.admin)
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }
}
