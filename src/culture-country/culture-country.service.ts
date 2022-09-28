import {
  ConflictException,
  Inject,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { CultureEntity } from 'src/culture/culture.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CultureService } from 'src/culture/culture.service';
import { CountryEntity } from 'src/country/country.entity';
import { CountryService } from 'src/country/country.service';
import { Cache } from 'cache-manager';

@Injectable()
export class CultureCountryService {
  constructor(
    @InjectRepository(CultureEntity)
    private cultureRepository: Repository<CultureEntity>,
    private countryService: CountryService,
    private cultureService: CultureService,
    @Inject('CACHE_MANAGER')
    private cacheManager: Cache,
  ) {}

  private async removeActualKeys(matchingChars: string) {
    const keys: string[] = await this.cacheManager.store.keys();
    const productsKeys = keys.filter((key) => key.search(matchingChars) === 0);
    productsKeys.map(async (key) => await this.cacheManager.del(key));
  }

  private findCountryInCulture(
    countryId,
    culture: CultureEntity,
  ): CountryEntity {
    const interestCountry: CountryEntity = culture.countries.find(
      (pr) => pr.id === countryId,
    );
    if (!interestCountry) {
      throw new PreconditionFailedException(
        'country with the given id is not associated to that culture',
      );
    }
    return interestCountry;
  }

  async addCountryToCulture(
    countryId: string,
    cultureId: string,
  ): Promise<CultureEntity> {
    const country: CountryEntity = await this.countryService.findOne(countryId);
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    if (culture.countries.find((pr) => pr.id === countryId)) {
      throw new ConflictException('Culture already has this country');
    }
    culture.countries.push(country);
    const newCulture = await this.cultureRepository.save(culture);
    await this.removeActualKeys(
      `CulturesCountries.cultureId.${cultureId}.countries`,
    );
    return newCulture;
  }

  async associateCountriesToCulture(
    cultureId: string,
    countries: CountryEntity[],
  ): Promise<CultureEntity> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    culture.countries = countries;
    const newCulture = await this.cultureRepository.save(culture);
    await this.removeActualKeys(
      `CulturesCountries.cultureId.${cultureId}.countries`,
    );
    return newCulture;
  }

  async deleteCountryFromCulture(countryId, cultureId): Promise<CultureEntity> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    const undesiredCountry: CountryEntity = this.findCountryInCulture(
      countryId,
      culture,
    );
    culture.countries = culture.countries.filter(
      (pr) => pr !== undesiredCountry,
    );
    const newCulture = await this.cultureRepository.save(culture);
    await this.removeActualKeys(
      `CulturesCountries.cultureId.${cultureId}.countries`,
    );
    return newCulture;
  }

  async findCountryByCultureIdCountryId(countryId: string, cultureId: string) {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    return this.findCountryInCulture(countryId, culture);
  }

  async findCultureCountries(cultureId: string) {
    const cacheKey = `CulturesCountries.cultureId.${cultureId}.countries`;
    const cached: CountryEntity[] = await this.cacheManager.get(cacheKey);
    if (!cached) {
      const culture: CultureEntity = await this.cultureService.findOne(
        cultureId,
      );
      await this.cacheManager.set(cacheKey, culture.countries);
      return culture.countries;
    }
    return cached;
  }
}
