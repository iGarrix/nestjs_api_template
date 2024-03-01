import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-file-fs')
  async uploadFileFsStorage(@UploadedFile('file') file: Express.Multer.File) {
    return await this.storageService.addFileAsync(file, 'storage/files');
  }

  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-file-multier')
  async uploadFileMultierStorage(
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is bad multier');
    }
    return true;
  }

  @HttpCode(201)
  @UseInterceptors(FilesInterceptor('files'))
  @Post('upload-files-fs')
  async uploadFilesFsStorage(@UploadedFiles() files: Express.Multer.File[]) {
    return await this.storageService.addFilesAsync(files, 'storage/files');
  }

  @HttpCode(200)
  @Get()
  async getFile(@Query('filename') filename: string, @Res() res: Response) {
    const file = await this.storageService.getFileAsync(
      filename,
      'storage/files',
    );
    file.pipe(res);
  }

  @HttpCode(200)
  @JwtAuth()
  @Roles(['ADMIN'])
  @Delete()
  async deleteFile(@Query('filename') filename: string) {
    return await this.storageService.deleteFileAsync(filename, 'storage/files');
  }
}
