import { HttpStatus, Injectable } from '@nestjs/common';
import { createImageURL } from 'src/lib/multerOptions';

@Injectable()
export class AssetService {
  async create(file: Express.Multer.File) {
    const generatedFile = createImageURL(file);
    return {
      statusCode: HttpStatus.CREATED,
      url: generatedFile,
    }
  }
}
