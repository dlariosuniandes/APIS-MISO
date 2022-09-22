import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CountryEntity } from './country.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
  ) {}

  private messageExceptionCountryNotFound =
    'The Country with the given id was not found';

  async findAll(): Promise<CountryEntity[]> {
    return await this.countryRepository.find();
  }

  async findOne(id: string): Promise<CountryEntity> {
    return await this.findOneBy(id);
  }

  async create(country: CountryEntity): Promise<CountryEntity> {
    return await this.countryRepository.save(country);
  }

  async update(id: string, country: CountryEntity): Promise<CountryEntity> {
    await this.findOneBy(id);
    return await this.countryRepository.save(country);
  }

  async delete(id: string) {
    const country: CountryEntity = await this.findOneBy(id);
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
