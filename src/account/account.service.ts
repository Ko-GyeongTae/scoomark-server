import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SignInDTO } from './dto/signin.dto';
import { SignUpDTO } from './dto/signup.dto';

@Injectable()
export class AccountService {
  constructor(
    private prismaService:PrismaService,
  ) { }
  async signUp(signUpDto: SignUpDTO) {
    const result = await this.prismaService.account.create({
      data: {
        ...signUpDto
      }
    })

    if (!result) {
      throw new HttpException (
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid request'
        },
        HttpStatus.BAD_REQUEST
      )
    }

    return (
      {
        status: HttpStatus.CREATED,
        message: 'Success'
      }
    )
  }

  async  signIn(signInDto: SignInDTO) {
    return 'This action adds a new account';
  }

}
