import { Controller, Post, Body, Delete, HttpCode, Req, UseGuards, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { SignInDTO } from './dto/signin.dto';
import { SignUpDTO } from './dto/signup.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './jwt/jwt.auth.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDTO) {
    return this.accountService.signUp(signUpDto);
  }

  @Post('/signin')
  @HttpCode(200)
  signIn(@Body() signInDto: SignInDTO) {
    return this.accountService.signIn(signInDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/signout')
  signOut(@Req() request:Request) {
    return this.accountService.signOut(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  profile(@Req() request:Request) {
    const { user } = request;
    return this.accountService.profile(user);
  }
}
