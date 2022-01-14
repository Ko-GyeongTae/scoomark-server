import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpLoggerMiddleware } from 'middleware/http.middleware';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { PlaceModule } from './place/place.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    AccountModule, 
    PlaceModule
  ],
  controllers: [AppController],
  providers: [PrismaService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes("*");
  }
}