import { CACHE_MANAGER, ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // constructor(
    //     @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    // ) {
    //     super();
    // }

    // async canActivate(context: ExecutionContext) {
    //     const request = context.switchToHttp().getRequest();

    //     const { authorization } = request.headers;

    //     if (authorization === undefined) {
    //         throw new HttpException(
    //             {
    //                 statusCode: HttpStatus.UNAUTHORIZED,
    //                 message: 'Invalid Token',
    //             },
    //             HttpStatus.UNAUTHORIZED,
    //         );
    //     }

    //     const token = authorization.replace('Bearer ', '')
    //     const value = await this.cacheManager.get(token);

    //     if (!value) {
    //         throw new HttpException(
    //             {
    //                 statusCode: HttpStatus.UNAUTHORIZED,
    //                 message: 'Invalid Token',
    //             },
    //             HttpStatus.UNAUTHORIZED,
    //         );
    //     }
    //     return true;
    // }
}
