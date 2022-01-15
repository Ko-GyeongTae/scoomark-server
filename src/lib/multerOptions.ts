import { HttpException } from "@nestjs/common";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import uuidRandom from "./uuidRandom";

export const multerOptions = {
    fileFilter: (request, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {  //image 형식.
            callback(null, true);
        } else {
            callback(new HttpException('Unsupported image format.', 400), false);
        }
    },

    storage: diskStorage({
        destination: (request, file, callback) => {
            const uploadPath: string = './public';
            //upload 경로 지정

            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath);
                //경로가 없을 시 폴더 생성
            }
            callback(null, uploadPath);
        },
        filename: (request, file, callback) => {
            callback(null, uuidRandom(file));
        }
    })
}

export const createImageURL = (file): string => {
    const serverAddress: string = process.env.SERVER_ADDRESS;

    // 파일이 저장되는 경로: 서버주소/public 폴더
    // 위의 조건에 따라 파일의 경로를 생성해줍니다.
    return `${serverAddress}/public/${file.filename}`;
}