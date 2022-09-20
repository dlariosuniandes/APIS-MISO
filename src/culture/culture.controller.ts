import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CultureDto } from './culture.dto';
import { CultureEntity } from './culture.entity';
import { CultureService } from './culture.service';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt-strategy/jwt-auth.guard';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('cultures')
export class CultureController {
  constructor(private readonly cultureService: CultureService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.cultureService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':cultureId')
  async findOne(@Param('cultureId') cultureId: string) {
    return await this.cultureService.findOne(cultureId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() cultureDto: CultureDto) {
    const culture: CultureEntity = plainToInstance(CultureEntity, cultureDto);
    return await this.cultureService.create(culture);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':cultureId')
  async update(
    @Param('cultureId') cultureId: string,
    @Body() cultureDto: CultureDto,
  ) {
    const culture: CultureEntity = plainToInstance(CultureEntity, cultureDto);
    return await this.cultureService.update(cultureId, culture);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':cultureId')
  @HttpCode(204)
  async delete(@Param('cultureId') cultureId: string) {
    await this.cultureService.delete(cultureId);
  }
}
