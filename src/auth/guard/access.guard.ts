import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Public } from 'src/common/decorator/public.decorator';

@Injectable()
export class AccessGuard extends AuthGuard('access') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.get(Public, context.getHandler());
        if (isPublic) return true;
        return super.canActivate(context);
    }
}
