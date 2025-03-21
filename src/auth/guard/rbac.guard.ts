import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RBAC } from 'src/common/decorator/rabc.decorator';
import { Role } from 'src/common/entities/user.entity';

@Injectable()
export class RBACGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const role = this.reflector.get(RBAC, context.getHandler());
        const user = req?.user;
        const userRole = user?.role;

        if (role === undefined) return true;
        if (!user || !userRole) return false;
        if (!Object.values(Role).includes(userRole)) return false;

        return userRole <= role;
    }
}
