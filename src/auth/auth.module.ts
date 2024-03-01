import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenServiceModule } from 'src/services/token-service/token-service.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    TokenServiceModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      // For set up difference expire time for access/refresh
      //signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
