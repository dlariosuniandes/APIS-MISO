import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CountryDto } from 'src/country/country.dto';
import { CountryEntity } from 'src/country/country.entity';
import { CultureEntity } from 'src/culture/culture.entity';
import { CultureCountryDto } from './culture-country.dto';
import { CultureCountryService } from './culture-country.service';

@Resolver()
export class CultureCountryResolver {
  constructor(private cultureCountryService: CultureCountryService) {}

  @Query(() => CountryEntity)
  findCountryByCultureIdCountryId(
    @Args('countryId') countryId: string,
    @Args('cultureId') cultureId: string,
  ): Promise<CountryEntity> {
    return this.cultureCountryService.findCountryByCultureIdCountryId(
      countryId,
      cultureId,
    );
  }

  @Query(() => [CountryEntity])
  findCultureCountries(
    @Args('cultureId') cultureId: string,
  ): Promise<CountryEntity[]> {
    return this.cultureCountryService.findCultureCountries(cultureId);
  }

  @Mutation(() => [CultureEntity])
  addCountryToCulture(
    @Args('cultureId') cultureId: string,
    @Args('countryId') countryId: string,
  ): Promise<CultureEntity> {
    return this.cultureCountryService.addCountryToCulture(countryId, cultureId);
  }

  @Mutation(() => [CultureEntity])
  associateCountriesToCulture(
    @Args('cultureId') cultureId: string,
    @Args('countries', { type: () => [CultureCountryDto] })
    countriesDto: CultureCountryDto[],
  ): Promise<CultureEntity> {
    const countries = plainToInstance(CountryEntity, countriesDto);
    return this.cultureCountryService.associateCountriesToCulture(
      cultureId,
      countries,
    );
  }

  @Mutation(() => [CultureEntity])
  deleteCountryFromCulture(
    @Args('cultureId') cultureId: string,
    @Args('countryId') countryId: string,
  ): Promise<CultureEntity> {
    return this.cultureCountryService.deleteCountryFromCulture(
      countryId,
      cultureId,
    );
  }
}
