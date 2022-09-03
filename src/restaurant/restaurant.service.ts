import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors';
import { Repository } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async findAll(): Promise<RestaurantEntity[]> {
    return await this.restaurantRepository.find({
      relations: ['micheline-stars'],
    });
  }

  async findOne(id: string): Promise<RestaurantEntity> {
    return await this.#findOneBy(id, ['micheline-stars']);
  }

  async create(restaurant: RestaurantEntity): Promise<RestaurantEntity> {
    return await this.restaurantRepository.save(restaurant);
  }

  async update(
    id: string,
    restaurant: RestaurantEntity,
  ): Promise<RestaurantEntity> {
    await this.#findOneBy(id);
    return await this.restaurantRepository.save(restaurant);
  }

  async delete(id: string) {
    const restaurant: RestaurantEntity = await this.#findOneBy(id);
    return await this.restaurantRepository.delete(restaurant);
  }

  async #findOneBy(
    id: string,
    relations: Array<string> = [],
  ): Promise<RestaurantEntity> {
    const restaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({
        where: { id },
        relations: relations,
      });
    if (!restaurant) await this.#handleNotFoundRestaurant();
    return restaurant;
  }

  async #handleNotFoundRestaurant() {
    throw new BusinessLogicException(
      'The restaurant with the given id was not found',
      BusinessError.NOT_FOUND,
    );
  }
}
