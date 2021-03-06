import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/account/jwt/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) { }

  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto, @Req() request: Request) {
    const { user } = request;
    return this.placeService.create(createPlaceDto, user);
  }

  @Get()
  findAll() {
    return this.placeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placeService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placeService.remove(id);
  }

  @Post('bookmark/:id')
  bookMark(@Param('id') id: string, @Req() request: Request) {
    const { user } = request;
    return this.placeService.bookMark(id, user);
  }

  @Post('pilgrimage/:id')
  pilgrimage(@Param('id') id: string, @Req() request: Request){
    const { user } = request;
    const { aid } = request.body;
    return this.placeService.pilgrimage(id, user, aid);
  }
}
