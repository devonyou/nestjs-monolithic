import { Reflector } from '@nestjs/core';
import { Role } from '../entities/user.entity';

export const RBAC = Reflector.createDecorator<Role>();
