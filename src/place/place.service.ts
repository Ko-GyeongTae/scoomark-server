import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlaceService {
  constructor(
    private prismaService: PrismaService,
  ) { }

  async create(createPlaceDto: CreatePlaceDto, user: Account) {
    const { place, way, content, aid, latitude, longtitude } = createPlaceDto;
    const result = await this.prismaService.place.create({
      data: {
        place,
        way, 
        content,
        latitude,
        longtitude,
        writer: {
          connect: {
            id: user.id,
          }
        },
        url: {
          connect: {
            id: aid,
          }
        }
      }
    });

    return {
      statusCode: HttpStatus.CREATED,
      result,
    }
  }

  async findAll() {
    const places = await this.prismaService.place.findMany();
    return {
      statusCode: HttpStatus.OK,
      places,
    }
  }

  async findOne(id: string) {
    const place = await this.prismaService.place.findUnique({ where: { id } });
    if (!place) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Cannot find places",
        },
        HttpStatus.NOT_FOUND,
      )
    }

    return {
      statusCode: HttpStatus.OK,
      place,
    }
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto) {
    const { way, content } = updatePlaceDto
    const place = await this.prismaService.place.update({
      data: {
        way,
        content,
      },
      where: {
        id,
      }
    })

    if (!place) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Fail to update",
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    return { 
      statusCode: HttpStatus.CREATED,
      place,
    }
  }

  async remove(id: string) {
    const place = await this.prismaService.place.delete({ where: { id } })
    
    if (!place) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Cannot find places",
        },
        HttpStatus.NOT_FOUND,
      )
    }

    return {
      statusCode: HttpStatus.OK,
      message: "Success",
    }
  }
}
