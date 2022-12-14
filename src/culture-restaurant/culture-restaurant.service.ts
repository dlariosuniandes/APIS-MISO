import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CultureEntity } from '../culture/culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import { CultureService } from '../culture/culture.service';
import { Cache } from 'cache-manager';

@Injectable()
export class CultureRestaurantService {
  constructor(
    @InjectRepository(CultureEntity)
    private readonly cultureRepository: Repository<CultureEntity>,
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private restaurantService: RestaurantService,
    private cultureService: CultureService,
  ) {}

  cacheKey = 'culture-restaurant';

  async addRestaurantToCulture(
    cultureId: string,
    restaurantId: string,
  ): Promise<CultureEntity> {
    const restaurant: RestaurantEntity = await this.restaurantService.findOne(
      restaurantId,
    );
    if (!restaurant)
      throw new BusinessLogicException(
        'The Restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    if (!culture)
      throw new BusinessLogicException(
        'The Culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    culture.restaurants = [...culture.restaurants, restaurant];
    return await this.cultureRepository.save(culture);
  }

  async findRestaurantByCultureIdAndRestaurantId(
    cultureId: string,
    restaurantId: string,
  ): Promise<RestaurantEntity> {
    const restaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({
        where: { id: restaurantId },
      });
    if (!restaurant)
      throw new BusinessLogicException(
        'The Restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const culture: CultureEntity = await this.cultureRepository.findOne({
      where: { id: cultureId },
      relations: ['restaurants'],
    });
    if (!culture)
      throw new BusinessLogicException(
        'The Culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const cultureRestaurant: RestaurantEntity = culture.restaurants.find(
      (e) => e.id === restaurant.id,
    );
    if (!cultureRestaurant)
      throw new BusinessLogicException(
        'The artwork with the given id is not associated to the museum',
        BusinessError.PRECONDITION_FAILED,
      );
    return cultureRestaurant;
  }

  async findRestaurantsByCultureId(
    cultureId: string,
  ): Promise<RestaurantEntity[]> {
    const cached = await this.cacheManager.get<RestaurantEntity[]>(
      this.cacheKey + '_' + cultureId,
    );

    if (!cached) {
      const culture = await this.cultureService.findOne(cultureId);
      if (!culture)
        throw new BusinessLogicException(
          'The Culture with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      await this.cacheManager.set(
        this.cacheKey + '_' + cultureId,
        culture.restaurants,
      );
      return culture.restaurants;
    }
    return cached;
  }

  async associateRestaurantsToCulture(
    cultureId: string,
    restaurants: RestaurantEntity[],
  ): Promise<CultureEntity> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    if (!culture)
      throw new BusinessLogicException(
        'The Culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant: RestaurantEntity = await this.restaurantService.findOne(
        restaurants[i].id,
      );
      if (!restaurant)
        throw new BusinessLogicException(
          'The Restaurant with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    culture.restaurants = restaurants;
    return await this.cultureRepository.save(culture);
  }

  async deleteRestaurantFromCulture(cultureId: string, restaurantId: string) {
    const restaurant: RestaurantEntity = await this.restaurantService.findOne(
      restaurantId,
    );
    if (!restaurant)
      throw new BusinessLogicException(
        'The Restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    if (!culture)
      throw new BusinessLogicException(
        'The Culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const cultureRestaurant: RestaurantEntity = culture.restaurants.find(
      (e) => e.id === restaurant.id,
    );
    if (!cultureRestaurant)
      throw new BusinessLogicException(
        'The Restaurant with the given id is not associated to the Culture',
        BusinessError.PRECONDITION_FAILED,
      );

    culture.restaurants = culture.restaurants.filter(
      (e) => e.id !== restaurantId,
    );
    await this.cultureRepository.save(culture);
  }
}
