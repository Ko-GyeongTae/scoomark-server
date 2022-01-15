import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor (
    private prismaService: PrismaService,
  ) { }

  async create(createCommentDto: CreateCommentDto, user: Account) {
    const { pid, content } = createCommentDto;

    const _place = await this.prismaService.place.findUnique({ where: { id: pid } });

    if (!_place) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Cannot find places",
        },
        HttpStatus.NOT_FOUND,
      )
    }
    
    const result = await this.prismaService.comment.create({
      data: {
        content,
        writer: {
          connect: {
            id: user.id,
          },
        },
        place: {
          connect: {
            id: pid,
          }
        }
      }
    });

    return {
      statusCode: HttpStatus.CREATED,
      result,
    }
  }

  async findByPid(id: string) {
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
    
    const result = await this.prismaService.comment.findMany({
      where: {
        place: {
          id,
        }
      }
    });

    return {
      statusCode: HttpStatus.OK,
      result,
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const _comment = await this.prismaService.comment.findUnique({ where: { id } });

    if (!_comment) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Cannot find comment",
        },
        HttpStatus.NOT_FOUND,
      )
    }

    const { content } = updateCommentDto
    const comment = await this.prismaService.comment.update({
      data: {
        content,
      },
      where: {
        id,
      }
    })

    if (!comment) {
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
      comment,
    }
  }

  async remove(id: string) {
    const _comment = await this.prismaService.comment.findUnique({ where: { id } });

    if (!_comment) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Cannot find comment",
        },
        HttpStatus.NOT_FOUND,
      )
    }

    await this.prismaService.comment.delete({ where: { id } });

    return {
      statusCode: HttpStatus.OK,
      message: "Success",
    }
  }
}
