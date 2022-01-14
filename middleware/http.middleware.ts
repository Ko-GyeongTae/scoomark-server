import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';


@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP-LOGGER');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl: path } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const date = new Date().toISOString();
      const { statusCode } = response;

      this.logger.log(
        `[${method}|${ip}] ${statusCode} ${decodeURI(path)} -> ${date}`,
      );
    });

    next();
  }
}
