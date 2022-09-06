import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CultureDto } from './culture.dto';
import { CultureEntity } from './culture.entity';
import { CultureService } from './culture.service';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('cultures')
export class CultureController {
  constructor(private readonly cultureService: CultureService) {}

  @Get()
  async findAll() {
    await this.cultureService.findAll();
  }

  @Get(':cultureId')
  async findOne(@Param('cultureId') cultureId: string) {
    await this.cultureService.findOne(cultureId);
  }

  @Post()
  async create(@Body() cultureDto: CultureDto) {
    const culture: CultureEntity = plainToInstance(CultureEntity, cultureDto);
    return await this.cultureService.create(culture);
  }

  @Put()
  async update(
    @Param('cultureId') cultureId: string,
    @Body() cultureDto: CultureDto,
  ) {
    const culture: CultureEntity = plainToInstance(CultureEntity, cultureDto);
    return await this.cultureService.update(cultureId, culture);
  }

  @Delete(':museumId')
  @HttpCode(204)
  async delete(@Param('cultureId') cultureId: string) {
    await this.cultureService.delete(cultureId);
  }
}
