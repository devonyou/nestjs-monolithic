import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator((data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req?.user?.sub;
});
