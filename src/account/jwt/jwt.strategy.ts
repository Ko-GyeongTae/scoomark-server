import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma.service';

type ValidatePayload = {
  id:     string;
  uid:    string;
  name:   string;
  point:  number;
  school: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  validate = async (payload: ValidatePayload) => {
    const account = await this.prismaService.account.findUnique({ 
      where: { 
        id: payload.id 
      }
    })
    return account;
  };
}
