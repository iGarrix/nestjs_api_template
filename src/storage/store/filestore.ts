import { Guid } from 'guid-typescript';
import { diskStorage } from 'multer';
import { extname } from 'path';

// For only uploading files without validation body data!!!
export const fileStore = {
  storage: diskStorage({
    // ./storage/ it is a folder in root dir
    destination: './storage/multier',
    filename: (req, file, cb) => {
      const filename: string = Guid.create().toString();
      const extension: string = extname(file.originalname).toLowerCase();
      cb(null, `${filename}${extension}`);
    },
  }),
};
