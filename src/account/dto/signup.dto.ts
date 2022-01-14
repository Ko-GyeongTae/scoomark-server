import { IsString } from "class-validator";

export class SignUpDTO {
    @IsString()
    uid: string;

    @IsString()
    password: string;

    @IsString()
    name: string;

    @IsString()
    school: string;
}
