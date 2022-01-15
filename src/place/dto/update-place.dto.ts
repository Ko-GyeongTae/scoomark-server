import { IsOptional, IsString } from "class-validator";

export class UpdatePlaceDto {
    @IsOptional()
    @IsString()
    way?: string;

    @IsOptional()
    @IsString()
    content?: string
}
