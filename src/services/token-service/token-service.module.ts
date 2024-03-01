import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { TokenService } from './token-service.service';

@Module({
  imports: [UsersModule],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService, JwtStrategy],
})
export class TokenServiceModule {}
