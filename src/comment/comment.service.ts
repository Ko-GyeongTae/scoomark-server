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
    const { content } = updateCommentDto
    const comment = await this.prismaService.place.update({
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
    const comment = await this.prismaService.place.delete({ where: { id } });

    if (!comment) {
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
      message: "Success",
    }
  }
}
