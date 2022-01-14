import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'JWT',
      signOptions: {
        expiresIn: process.env.STAGE === 'dev' ? '1y' : '1d'
      }
    }),
    PassportModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, JwtStrategy],
  exports: [AccountService]
})
export class AccountModule { }
