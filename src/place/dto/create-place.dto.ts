import { IsNumber, IsString } from "class-validator";

export class CreatePlaceDto {
    @IsString()
    place: string;

    @IsString()
    way: string;

    @IsString()
    content: string;

    @IsString()
    aid: string;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longtitude: number;
}
