import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../../prisma.service';

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
    private readonly prismaService: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JWT',
    });
  }

  validate = async ({ id }: VaildatePayload) => {
    return await this.prismaService.account.findUnique({ where: { id } });
  };
}
