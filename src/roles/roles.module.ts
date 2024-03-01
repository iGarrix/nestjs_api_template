import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TokenService } from 'src/services/token-service/token-service.service';
import { UsersService } from 'src/users/users.service';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  controllers: [RolesController],
  providers: [RolesService, UsersService, TokenService, PrismaService],
  exports: [RolesService],
})
export class RolesModule {}
