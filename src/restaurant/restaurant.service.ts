import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  cacheKey = 'restaurants';

  private messageExcepetionRestaurantNotFound =
    'The Restaurant with the given id was not found';

  async findAll(): Promise<RestaurantEntity[]> {
    const cached = await this.cacheManager.get<RestaurantEntity[]>(
      this.cacheKey,
    );

    if (!cached) {
      const restaurants = await this.restaurantRepository.find({
        relations: ['michelineStars'],
      });
      await this.cacheManager.set(this.cacheKey, restaurants);
      return restaurants;
    }
    return cached;
  }

  async findOne(id: string): Promise<RestaurantEntity> {
    return await this.findOneBy(id, ['michelineStars', 'country']);
  }

  async create(restaurant: RestaurantEntity): Promise<RestaurantEntity> {
    return await this.restaurantRepository.save(restaurant);
  }

  async update(
    id: string,
    restaurant: RestaurantEntity,
  ): Promise<RestaurantEntity> {
    const persistedRestaurant = await this.findOneBy(id);
    return await this.restaurantRepository.save({
      ...persistedRestaurant,
      ...restaurant,
    });
  }

  async delete(id: string) {
    const restaurant: RestaurantEntity = await this.findOneBy(id);
    return await this.restaurantRepository.delete(restaurant);
  }

  async findOneBy(
    id: string,
    relations: Array<string> = [],
  ): Promise<RestaurantEntity> {
    const restaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({
        where: { id: id },
        relations: relations,
      });
    if (!restaurant) await this.#handleNotFoundRestaurant();
    return restaurant;
  }

  async #handleNotFoundRestaurant() {
    throw new BusinessLogicException(
      this.messageExcepetionRestaurantNotFound,
      BusinessError.NOT_FOUND,
    );
  }
}
