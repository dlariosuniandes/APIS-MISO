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
import { plainToInstance } from 'class-transformer';
import { CountryService } from './country.service';
import { CountryDto } from './country.dto';
import { CountryEntity } from './country.entity';
import { JwtAuthGuard } from 'src/auth/jwt-strategy/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin-guard/admin.guard';

@ApiTags('Countries')
@UseInterceptors(BusinessErrorsInterceptor)
@ApiBearerAuth()
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.countryService.findAll();
  }

  @Get(':countryId')
  async findOne(@Param('countryId') countryId: string) {
    return await this.countryService.findOne(countryId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() countryDto: CountryDto) {
    const country: CountryEntity = plainToInstance(CountryEntity, countryDto);
    return await this.countryService.create(country);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':countryId')
  async update(
    @Param('countryId') countryId: string,
    @Body() countryDto: CountryDto,
  ) {
    const country: CountryEntity = plainToInstance(CountryEntity, countryDto);
    return await this.countryService.update(countryId, country);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':countryId')
  @HttpCode(204)
  async delete(@Param('countryId') countryId: string) {
    await this.countryService.delete(countryId);
  }
}
