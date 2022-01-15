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
        url: aid
      }
    });

    const { point } = await this.prismaService.account.findUnique({ where: { id: user.id } })

    await this.prismaService.account.update({
      where: {
        id: user.id,
      },
      data: {
        point: point + 3,
      },
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

    const images = place.url.split('/');
    delete place.url;

    place["assets"] = [];
    images.map((i) => {
      place["assets"].push("https://neon-dev.kro.kr:5012/public/" + i);
    });
    place["bookcount"] = await this.prismaService.bookMark.count({ 
      where: { 
        place: {
          id,
        }
      }
    })

    return {
      statusCode: HttpStatus.OK,
      place,
    }
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto) {
    const { way, content } = updatePlaceDto
    const _place = await this.prismaService.place.findUnique({ where: { id } });

    if (!_place) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Cannot find places",
        },
        HttpStatus.NOT_FOUND,
      )
    }

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
    const _place = await this.prismaService.place.findUnique({ where: { id } });

    if (!_place) {
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
      statusCode: HttpStatus.OK,
      message: "Success",
    }
  }

  async bookMark(id: string, user: Account) {
    const _place = await this.prismaService.place.findUnique({ where: { id } });

    if (!_place) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Cannot find places",
        },
        HttpStatus.NOT_FOUND,
      )
    } 

    const bookmark = await this.prismaService.bookMark.create({
      data: {
        account: {
          connect: {
            id: user.id,
          }
        },
        place: {
          connect: {
            id,
          }
        }
      }
    });

    return { 
      statusCode: HttpStatus.CREATED,
      bookmark,
    }
  }
}
