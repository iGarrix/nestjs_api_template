import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import * as fs from 'fs/promises';
import { Guid } from 'guid-typescript';
import { extname, join } from 'path';

@Injectable()
export class FileManager {
  async saveFileAsync(file: Express.Multer.File, pathFolder: string) {
    const newFilename: string = Guid.create().toString();
    const extension: string = extname(file.originalname).toLowerCase();
    const storage_path = join(
      process.cwd(),
      `/${pathFolder}/${newFilename}${extension}`,
    );
    await this.saveFileBuffer(storage_path, file.buffer);
    return {
      savedFilename: `${newFilename}${extension}`,
      status: 'success',
    };
  }

  async saveFilesAsync(files: Express.Multer.File[], pathFolder: string) {
    const listSaves: Array<any> = [];
    const listError: Array<any> = [];
    for (let index = 0; index < files.length; index++) {
      try {
        const response = await this.saveFileAsync(files[index], pathFolder);
        listSaves.push(response);
      } catch (error) {
        listError.push({
          filename: files[index].originalname,
          error: 'Cannot save file',
        });
      }
    }
    return { savedList: listSaves, errors: listError };
  }

  async deleteFileAsync(filename: string, pathFolder: string) {
    try {
      const fpath = join(process.cwd(), `/${pathFolder}/${filename}`);
      if (await !this.checkFileExist(fpath)) throw 'not exist';
      await fs.unlink(fpath);
      return {
        deletedFilename: `${filename}`,
        status: 'success',
      };
    } catch (error) {
      throw new BadRequestException(`File not found`);
    }
  }

  async getFileAsync(filename: string, pathFolder: string) {
    const fpath = join(process.cwd(), `/${pathFolder}/${filename}`);
    if (await this.checkFileExist(fpath)) {
      return createReadStream(fpath);
    }
    throw new NotFoundException('File not found');
  }

  private async saveFileBuffer(
    destination: string,
    buffer: Buffer,
  ): Promise<boolean> {
    try {
      await fs.writeFile(destination, buffer);
      return true;
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  private async checkFileExist(path: string) {
    try {
      await fs.access(path);
      return true;
    } catch (error) {
      return false;
    }
  }
}
