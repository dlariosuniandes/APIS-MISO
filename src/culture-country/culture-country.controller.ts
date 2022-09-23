import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CountryDto } from 'src/country/country.dto';
import { CountryEntity } from 'src/country/country.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CultureCountryService } from './culture-country.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Cultures-Countries')
@ApiBearerAuth()
@Controller('cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class CultureCountryController {
  constructor(private readonly cultureCountryService: CultureCountryService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':cultureId/countries/:countryId')
  async addCountryToCulture(
    @Param('cultureId') cultureId: string,
    @Param('countryId') countryId: string,
  ) {
    return await this.cultureCountryService.addCountryToCulture(
      countryId,
      cultureId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':cultureId/countries')
  async associateCountriesToCulture(
    @Param('cultureId') cultureId: string,
    @Body() countryDto: CountryDto[],
  ) {
    const countries = plainToInstance(CountryEntity, countryDto);
    return await this.cultureCountryService.associateCountriesToCulture(
      cultureId,
      countries,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':cultureId/countries/:countryId')
  @HttpCode(204)
  async deleteCountryOfACulture(
    @Param('cultureId') cultureId: string,
    @Param('countryId') countryId: string,
  ) {
    await this.cultureCountryService.deleteCountryFromCulture(
      countryId,
      cultureId,
    );
  }
}
