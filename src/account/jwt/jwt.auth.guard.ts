import { CACHE_MANAGER, ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    
}
