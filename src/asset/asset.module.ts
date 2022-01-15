import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { PrismaService } from 'src/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'public'),
    }),
  ],
  controllers: [AssetController],
  providers: [AssetService, PrismaService],
})
export class AssetModule {}
