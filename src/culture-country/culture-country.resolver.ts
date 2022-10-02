import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CultureCountryService } from './culture-country.service';
import { CultureEntity } from '../culture/culture.entity';
import { CountryEntity } from '../country/country.entity';
import { CountryDto } from '../country/country.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class CultureCountryResolver {
  constructor(private cultureCountryService: CultureCountryService) {}

  @Query(() => [CountryEntity])
  async cultureCountries(
    @Args('cultureId')
    cultureId: string,
  ): Promise<CountryEntity[]> {
    return await this.cultureCountryService.findCultureCountries(cultureId);
  }

  @Query(() => CountryEntity)
  async cultureCountry(
    @Args('cultureId')
    cultureId: string,
    @Args('countryId')
    countryId: string,
  ): Promise<CountryEntity> {
    return await this.cultureCountryService.findCountryByCultureIdCountryId(
      countryId,
      cultureId,
    );
  }

  @Mutation(() => CultureEntity)
  async addCultureCountry(
    @Args('cultureId')
    cultureId: string,
    @Args('countryId')
    countryId: string,
  ): Promise<CultureEntity> {
    return await this.cultureCountryService.addCountryToCulture(
      countryId,
      cultureId,
    );
  }

  @Mutation(() => CultureEntity)
  async removeCultureCountry(
    @Args('cultureId')
    cultureId: string,
    @Args('countryId')
    countryId: string,
  ): Promise<CultureEntity> {
    return await this.cultureCountryService.deleteCountryFromCulture(
      countryId,
      cultureId,
    );
  }

  @Mutation(() => CultureEntity)
  async updateCultureCountries(
    @Args('cultureId')
    cultureId: string,
    @Args('countriesDtos', { type: () => [CountryDto] })
    countriesDtos: CountryDto[],
  ): Promise<CultureEntity> {
    const countries = countriesDtos.map((country) =>
      plainToInstance(CountryEntity, country),
    );
    return await this.cultureCountryService.associateCountriesToCulture(
      cultureId,
      countries,
    );
  }
}
