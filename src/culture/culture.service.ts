import { Inject, Injectable } from '@nestjs/common';
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
  constructor(
    @InjectRepository(CultureEntity)
    private readonly cultureRepository: Repository<CultureEntity>,
    @Inject('CACHE_MANAGER')
    private cacheManager: Cache,
  ) {}

  private async removeActualKeys(keyChars: string) {
    const keys: string[] = await this.cacheManager.store.keys();
    const productsKeys = keys.filter((key) => key.search(keyChars) === 0);
    productsKeys.map(async (key) => await this.cacheManager.del(key));
  }

  async findAll(): Promise<CultureEntity[]> {
    return await this.cultureRepository.find();
  }

  async findOne(id: string): Promise<CultureEntity> {
    const cacheKey = `cultures.${id}`;
    const cached: CultureEntity = await this.cacheManager.get(cacheKey);
    if (!cached) {
      const culture: CultureEntity = await this.cultureRepository.findOne({
        where: { id },
        relations: ['recipes', 'products', 'restaurants', 'countries'],
        relationLoadStrategy: 'query',
      });
      if (!culture) {
        throw new BusinessLogicException(
          'The culture with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      }
      await this.cacheManager.set(cacheKey, culture);
      return culture;
    }
    return cached;
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
