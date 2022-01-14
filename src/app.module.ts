import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpLoggerMiddleware } from 'middleware/http.middleware';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes("*");
  }
}