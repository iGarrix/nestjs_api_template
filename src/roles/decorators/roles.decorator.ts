import { Reflector } from '@nestjs/core';
import { Role } from 'prisma/generated/client';

export const Roles = Reflector.createDecorator<Role[]>();
