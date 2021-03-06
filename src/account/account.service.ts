import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SignInDTO } from './dto/signin.dto';
import { SignUpDTO } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Account } from '@prisma/client';

const HASH_LENGTH = 10;

@Injectable()
export class AccountService {
  constructor(
    // @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private jwtService:JwtService,
    private prismaService:PrismaService,
  ) { }
  async signUp({ password, ...signUpDto }: SignUpDTO) {
    const hash = await bcrypt.hash(password, HASH_LENGTH);
    const _isExist = await this.prismaService.account.findUnique({ where: { uid: signUpDto.uid }});

    if (_isExist) {
      throw new HttpException (
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'This id is alreaday exist',
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    const result = await this.prismaService.account.create({
      data: {
        ...signUpDto,
        password: hash,
      }
    })

    if (!result) {
      throw new HttpException (
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid request',
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    return (
      {
        statusCode: HttpStatus.CREATED,
        message: 'Success',
      }
    )
  }

  async signIn({ uid, password }: SignInDTO) {
    const account = await this.prismaService.account.findUnique({ where: { uid } }) 
    
    if(!account) {
      throw new HttpException (
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Invalid account',
        },
        HttpStatus.FORBIDDEN,
      )
    }

    const isPasswordEqual = await bcrypt.compare(password, account.password);

    if(!isPasswordEqual) {
      throw new HttpException (
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Invalid account',
        },
        HttpStatus.FORBIDDEN,
      )
    }

    const { id, name, point, school } = account;
    const accessToken = this.jwtService.sign({id, uid, name, point, school})
    // await this.cacheManager.set(accessToken, account, { ttl: 86400 });
    
    return {
      statusCode: HttpStatus.OK,
      token: accessToken,
    }
  }

  async signOut(request: Request) {
    // const token = request.headers.authorization.replace('Bearer ', '');
    // await this.cacheManager.del(token);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
    }
  }

  async profile(user: Account) {
    const account = await this.prismaService.account.findUnique({ 
      where: { 
        id: user.id,
      },
      include: {
        bookMark: true,
        place: true,
      }
    });
    delete account.password;

    const rank = await this.prismaService.$queryRawUnsafe(
      'SELECT * FROM (SELECT name, point, RANK() OVER (ORDER BY point DESC) AS \'rank\' FROM Account) AS R WHERE (R.name = ?)',
      user.name  
    );

    account["rank"] = rank[0].rank;

    return {
      statusCode: HttpStatus.OK,
      account,
    }
  }
}
