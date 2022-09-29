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
import { plainToInstance } from 'class-transformer';
import { CountryDto } from 'src/country/country.dto';
import { CountryEntity } from 'src/country/country.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CultureCountryService } from './culture-country.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../authorization/role.decorator';
import { Role } from 'src/shared/enums/role.enum';

@ApiTags('Cultures-Countries')
@ApiBearerAuth()
@Controller('cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class CultureCountryController {
  constructor(private readonly cultureCountryService: CultureCountryService) {}

  @Roles(Role.ALLOW_CREATE)
  @Post(':cultureId/countries/:countryId')
  @HttpCode(200)
  async addCountryToCulture(
    @Param('cultureId') cultureId: string,
    @Param('countryId') countryId: string,
  ) {
    return await this.cultureCountryService.addCountryToCulture(
      countryId,
      cultureId,
    );
  }

  @Roles(Role.ALLOW_CREATE)
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

  @Roles(Role.ALLOW_DELETE)
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

  @Roles(Role.READ_ONLY)
  @Get(':cultureId/countries/')
  async findCultureCountries(@Param('cultureId') cultureId: string) {
    return await this.cultureCountryService.findCultureCountries(cultureId);
  }

  @Roles(Role.READ_ONLY)
  @Get(':cultureId/countries/:countryId')
  async findCultureCountry(
    @Param('cultureId') cultureId: string,
    @Param('countryId') countryId: string,
  ) {
    return await this.cultureCountryService.findCountryByCultureIdCountryId(
      countryId,
      cultureId,
    );
  }
}
