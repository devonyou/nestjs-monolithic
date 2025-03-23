import { Reflector } from '@nestjs/core';

export const ResponseTime = Reflector.createDecorator<number>();
