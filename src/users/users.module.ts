import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RolesModule } from 'src/roles/roles.module';
import { TokenService } from 'src/services/token-service/token-service.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [RolesModule],
  controllers: [UsersController],
  providers: [UsersService, TokenService, PrismaService],
  exports: [UsersService, PrismaService],
})
export class UsersModule {}
