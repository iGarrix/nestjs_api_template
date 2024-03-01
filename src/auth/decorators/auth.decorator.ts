import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';

// export const JwtAuth = () => UseGuards(JwtAuthGuard);
export const JwtAuth = () => UseGuards(JwtAuthGuard, RolesGuard);
