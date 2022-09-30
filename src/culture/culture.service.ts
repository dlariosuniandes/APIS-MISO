import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CultureEntity } from './culture.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class CultureService {
  cacheKey = 'cultures';

  constructor(
    @InjectRepository(CultureEntity)
    private readonly cultureRepository: Repository<CultureEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private async removeActualKeys(keyChars: string) {
    const keys: string[] = await this.cacheManager.store.keys();
    const productsKeys = keys.filter((key) => key.search(keyChars) === 0);
    productsKeys.map(async (key) => await this.cacheManager.del(key));
  }

  async findAll(skip = 0, amount = 50000): Promise<CultureEntity[]> {
    const cacheKey = `cultures.skip_${skip}.amount_${amount}`;
    const cached: CultureEntity[] = await this.cacheManager.get<
      CultureEntity[]
    >(cacheKey);
    if (!cached) {
      const culture = await this.cultureRepository.find({
        skip: skip,
        take: amount,
      });
      await this.cacheManager.set(this.cacheKey, culture);
      return culture;
    }
    return cached;
  }

  async findOne(id: string): Promise<CultureEntity> {
    const culture: CultureEntity = await this.cultureRepository.findOne({
      where: { id },
      relations: ['recipes', 'products', 'restaurants', 'countries'],
      //relationLoadStrategy: 'query',
    });
    if (!culture) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return culture;
  }

  async create(culture: CultureEntity): Promise<CultureEntity> {
    return await this.cultureRepository.save(culture);
  }

  async update(id: string, culture: CultureEntity): Promise<CultureEntity> {
    const persistedCulture: CultureEntity =
      await this.cultureRepository.findOne({ where: { id } });
    if (!persistedCulture)
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.removeActualKeys(`cultures.${id}`);
    return await this.cultureRepository.save({
      ...persistedCulture,
      ...culture,
    });
  }

  async delete(id: string) {
    const culture: CultureEntity = await this.cultureRepository.findOne({
      where: { id },
    });
    if (!culture)
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.removeActualKeys(`cultures.${id}`);
    await this.cultureRepository.remove(culture);
  }
}
