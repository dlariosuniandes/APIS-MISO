import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CultureEntity } from './culture.entity';

@Injectable()
export class CultureService {
  constructor(
    @InjectRepository(CultureEntity)
    private readonly cultureRepository: Repository<CultureEntity>,
  ) {}

  async findAll(): Promise<CultureEntity[]> {
    return await this.cultureRepository.find({
      relations: ['recipes', 'restaurants', 'products', 'recipes'],
    });
  }

  async findOne(id: string): Promise<CultureEntity> {
    const culture: CultureEntity = await this.cultureRepository.findOne({
      where: { id },
      relations: ['recipes', 'products', 'restaurants', 'countries'],
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

    await this.cultureRepository.remove(culture);
  }
}
