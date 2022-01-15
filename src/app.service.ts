import { HttpStatus, Injectable } from "@nestjs/common";
import { createImageURL } from "./lib/multerOptions";
import { PrismaService } from "./prisma.service";


@Injectable()
export class AppService {
    constructor(
        private prismaService: PrismaService,
    ) { }
    async create(file: Express.Multer.File) {
        const generatedFile = createImageURL(file);
        return {
            statusCode: HttpStatus.CREATED,
            url: generatedFile,
        }
    }
}