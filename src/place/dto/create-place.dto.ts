import { IsString } from "class-validator";

export class CreatePlaceDto {
    @IsString()
    place: string;

    @IsString()
    way: string;

    @IsString()
    content: string;

    @IsString()
    aid: string;

    @IsString()
    latitude: string;

    @IsString()
    longtitude: string;
}
