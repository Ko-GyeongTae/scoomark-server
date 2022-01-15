import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpLoggerMiddleware } from 'middleware/http.middleware';
import { AppController } from './app.controller';
import { PlaceModule } from './place/place.module';
import { AccountModule } from './account/account.module';
import { PrismaService } from './prisma.service';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    AccountModule, 
    PlaceModule, CommentModule
  ],
  controllers: [AppController],
  providers: [PrismaService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes("*");
  }
}