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
import { plainToInstance } from 'class-transformer';
import { CountryService } from './country.service';
import { CountryDto } from './country.dto';
import { CountryEntity } from './country.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async findAll() {
    return await this.countryService.findAll();
  }

  @Get(':countryId')
  async findOne(@Param('countryId') countryId: string) {
    return await this.countryService.findOne(countryId);
  }

  @Post()
  async create(@Body() countryDto: CountryDto) {
    const country: CountryEntity = plainToInstance(CountryEntity, countryDto);
    return await this.countryService.create(country);
  }

  @Put(':countryId')
  async update(
    @Param('countryId') countryId: string,
    @Body() countryDto: CountryDto,
  ) {
    const country: CountryEntity = plainToInstance(CountryEntity, countryDto);
    return await this.countryService.update(countryId, country);
  }

  @Delete(':countryId')
  @HttpCode(204)
  async delete(@Param('countryId') countryId: string) {
    await this.countryService.delete(countryId);
  }
}
