import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileManagerModule } from 'src/services/file-manager/file-manager.module';
import { UsersModule } from 'src/users/users.module';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  imports: [MulterModule.register(), UsersModule, FileManagerModule],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
