import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CultureEntity } from 'src/culture/culture.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/errors';
import { Repository } from 'typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import { CultureService } from '../culture/culture.service';

@Injectable()
export class CultureRestaurantService {
  constructor(
    @InjectRepository(CultureEntity)
    private readonly cultureRepository: Repository<CultureEntity>,

    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,

    private restaurantService: RestaurantService,

    private cultureService: CultureService,
  ) {}

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

  async findRestaurantsByCultureId(
    cultureId: string,
  ): Promise<RestaurantEntity[]> {
    const culture: CultureEntity = await this.cultureService.findOne(cultureId);
    if (!culture)
      throw new BusinessLogicException(
        'The Culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return culture.restaurants;
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
