import { CacheModule, Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PrismaService } from 'src/prisma.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.STAGE === 'dev' ? '1y' : '1d',
      }
    }),
    PassportModule,
    // CacheModule.register({
    //   store: redisStore,
    //   host: process.env.REDIS_HOST,
    //   port: process.env.REDIS_PORT,
    // }),
  ],
  controllers: [AccountController],
  providers: [AccountService, JwtStrategy, PrismaService],
  exports: [AccountService]
})
export class AccountModule { }
