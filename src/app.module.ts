import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpLoggerMiddleware } from 'middleware/http.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaceModule } from './place/place.module';
import { AccountModule } from './account/account.module';
import { PrismaService } from './prisma.service';
import { CommentModule } from './comment/comment.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AccountModule,
    PlaceModule,
    CommentModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes("*");
  }
}