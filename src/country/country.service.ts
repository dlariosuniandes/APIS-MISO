import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CountryEntity } from './country.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class CountryService {
  cacheKey = 'countries';

  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private async removeActualKeys() {
    const keys: string[] = await this.cacheManager.store.keys();
    const productsKeys = keys.filter((key) => key.search('countries.') === 0);
    for (const key of productsKeys) {
      await this.cacheManager.del(key);
    }
  }

  private messageExceptionCountryNotFound =
    'The Country with the given id was not found';

  async findAll(skip = 0, amount = 50000): Promise<CountryEntity[]> {
    const cacheKey = `countries.skip_${skip}.amount_${amount}`;
    const cached: CountryEntity[] = await this.cacheManager.get(cacheKey);
    if (!cached) {
      const countries = await this.countryRepository.find({
        skip: skip,
        take: amount,
      });
      await this.cacheManager.set(cacheKey, countries);
      return countries;
    }
    return cached;
  }

  async findAll2(skip = 0, amount = 50000): Promise<CountryEntity[]> {
    const cacheKey = `countries.skip_${skip}.amount_${amount}`;
    const cached: CountryEntity[] = await this.cacheManager.get(cacheKey);
    if (!cached) {
      const countries = await this.countryRepository.find({
        skip: skip,
        take: amount,
      });
      await this.cacheManager.set(cacheKey, countries);
      return countries;
    }
    return cached;
  }

  async findOne(id: string): Promise<CountryEntity> {
    return await this.findOneBy(id);
  }

  async create(country: CountryEntity): Promise<CountryEntity> {
    const newCountry: CountryEntity = await this.countryRepository.save(
      country,
    );
    await this.removeActualKeys();
    return newCountry;
  }

  async update(id: string, country: CountryEntity): Promise<CountryEntity> {
    await this.findOneBy(id);
    const newCountry: CountryEntity = await this.countryRepository.save(
      country,
    );
    await this.removeActualKeys();
    return newCountry;
  }

  async delete(id: string) {
    const country: CountryEntity = await this.findOneBy(id);
    await this.removeActualKeys();
    return await this.countryRepository.delete(country);
  }

  async findOneBy(
    id: string,
    relations: Array<string> = [],
  ): Promise<CountryEntity> {
    const country: CountryEntity = await this.countryRepository.findOne({
      where: { id: id },
      relations: relations,
    });
    if (!country) await this.#handleNotFoundCountry();
    return country;
  }

  async #handleNotFoundCountry() {
    throw new BusinessLogicException(
      this.messageExceptionCountryNotFound,
      BusinessError.NOT_FOUND,
    );
  }
}
