import { IsString } from "class-validator";

export class UpdatePlaceDto {
    @IsString()
    way?: string;

    @IsString()
    content?: string
}
