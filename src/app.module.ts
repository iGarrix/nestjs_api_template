import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { FileManagerModule } from './services/file-manager/file-manager.module';
import { TokenServiceModule } from './services/token-service/token-service.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [FileManagerModule, TokenServiceModule, RolesModule, UsersModule, AuthModule, StorageModule],
  providers: [AppService],
})
export class AppModule {}
