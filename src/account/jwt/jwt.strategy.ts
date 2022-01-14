import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, Req } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma.service';
import { request } from 'express';

type VaildatePayload = {
  id:     string;
  uid:    string;
  name:   string;
  point:  number;
  school: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  validate = async () => {
    const account = await this.cacheManager.get(request.headers.authorization.split('')[1]);
    if (!account) {
      throw new HttpException (
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Invalid Token',
        },
        HttpStatus.UNAUTHORIZED,
      )
    }
    
    return account;
  };
}
