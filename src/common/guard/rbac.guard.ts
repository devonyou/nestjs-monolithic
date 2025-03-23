import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RBAC } from 'src/common/decorator/rabc.decorator';
import { Role } from 'src/common/entities/user.entity';
import { Public } from '../decorator/public.decorator';

@Injectable()
export class RBACGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const role = this.reflector.get(RBAC, context.getHandler());
        const user = req?.user;
        const userRole = user?.role;
        const isPublic = this.reflector.get(Public, context.getHandler());

        if (isPublic) return true;
        if (!Object.values(Role).includes(role)) return true;

        if (!user) throw new UnauthorizedException(); // 401

        return userRole <= role; // 403
    }
}
