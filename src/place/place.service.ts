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
    await this.prismaService.place.create({
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
    })
  }

  async findAll() {
    const places = await this.prismaService.place.findMany();
    return {
      statusCode: 200,
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
      statusCode: 200,
      place
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
    await this.prismaService.place.delete({ where: { id } })

    return {
      statusCode: 200,
      message: "Success",
    }
  }
}
