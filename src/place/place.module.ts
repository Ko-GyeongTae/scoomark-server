import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PlaceController],
  providers: [PlaceService, PrismaService]
})
export class PlaceModule {}
