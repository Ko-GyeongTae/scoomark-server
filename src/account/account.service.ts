import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SignInDTO } from './dto/signin.dto';
import { SignUpDTO } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

const HASH_LENGTH = 10;

@Injectable()
export class AccountService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private jwtService:JwtService,
    private prismaService:PrismaService,
  ) { }
  async signUp({ password, ...signUpDto }: SignUpDTO) {
    const hash = await bcrypt.hash(password, HASH_LENGTH)
    const result = await this.prismaService.account.create({
      data: {
        ...signUpDto,
        password: hash,
      }
    })

    if (!result) {
      throw new HttpException (
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid request',
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    return (
      {
        status: HttpStatus.CREATED,
        message: 'Success',
      }
    )
  }

  async signIn({ uid, password }: SignInDTO) {
    const account = await this.prismaService.account.findUnique({ where: { uid } }) 
    
    if(!account) {
      throw new HttpException (
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Invalid account',
        },
        HttpStatus.FORBIDDEN,
      )
    }

    const isPasswordEqual = await bcrypt.compare(password, account.password);

    if(!isPasswordEqual) {
      throw new HttpException (
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Invalid account',
        },
        HttpStatus.FORBIDDEN,
      )
    }

    const accessToken = this.jwtService.sign({...account})
    await this.cacheManager.set(accessToken, account, { ttl: 86400 });
    
    return {
      status: HttpStatus.OK,
      token: accessToken,
    }
  }

}
