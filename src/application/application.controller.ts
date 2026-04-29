import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @UseInterceptors(FileInterceptor('cv'))
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.applicationService.create(createApplicationDto, file);
  }

  @Get()
  getMyApplication(
    @Query('userId') userId: string
  ) {
    return this.applicationService.getUserApplications(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(id);
  }

}
