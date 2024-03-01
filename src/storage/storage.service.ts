import { BadRequestException, Injectable } from '@nestjs/common';
import { FileManager } from 'src/services/file-manager/file-manager.service';

@Injectable()
export class StorageService {
  constructor(private fileService: FileManager) {}

  async addFileAsync(file: Express.Multer.File, section: string) {
    if (!file) {
      throw new BadRequestException('File is bad');
    }
    /*  Any other actions */
    return await this.fileService.saveFileAsync(file, section);
  }

  async addFilesAsync(files: Express.Multer.File[], section: string) {
    if (!files) {
      throw new BadRequestException('File is bad');
    }
    /*  Any other actions */
    return await this.fileService.saveFilesAsync(files, section);
  }

  async getFileAsync(filename: string, pathFolder: string) {
    return await this.fileService.getFileAsync(filename, pathFolder);
  }

  async deleteFileAsync(filename: string, pathFolder: string) {
    return await this.fileService.deleteFileAsync(filename, pathFolder);
  }
}
