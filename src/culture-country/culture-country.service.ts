import {
  ConflictException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { CultureEntity } from 'src/culture/culture.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CultureService } from 'src/culture/culture.service';
import { CountryEntity } from 'src/country/country.entity';
import { CountryService } from 'src/country/country.service';

@Injectable()
export class CultureCountryService {
  constructor(
    @InjectRepository(CultureEntity)
    private cultureRepository: Repository<CultureEntity>,
    private countryService: CountryService,
    private cultureService: CultureService,
  ) {}

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
    return await this.cultureRepository.save(culture);
  }

  async associateCountriesToCulture(
    cultureId: string,
    countries: CountryEntity[],
  ): Promise<CultureEntity> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    culture.countries = countries;
    return await this.cultureRepository.save(culture);
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
    return await this.cultureRepository.save(culture);
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
}
