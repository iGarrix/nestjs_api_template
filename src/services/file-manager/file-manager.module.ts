import { Module } from '@nestjs/common';
import { FileManager } from './file-manager.service';

@Module({
  providers: [FileManager],
  exports: [FileManager],
})
export class FileManagerModule {}
