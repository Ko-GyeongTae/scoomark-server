import { IsString } from "class-validator";

export class SignInDTO {
    @IsString()
    uid: string;

    @IsString()
    pasword: string;
}