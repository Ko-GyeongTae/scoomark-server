import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { AccountService } from './account.service';
import { SignInDTO } from './dto/signin.dto';
import { SignUpDTO } from './dto/signup.dto';

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

}
