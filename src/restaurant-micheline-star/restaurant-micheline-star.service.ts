import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MichelineStarEntity } from '../micheline-star/micheline-star.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { MichelineStarService } from '../micheline-star/micheline-star.service';

@Injectable()
export class RestaurantMichelineStarService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,

    @InjectRepository(MichelineStarEntity)
    private readonly michelineStarRepository: Repository<MichelineStarEntity>,

    private readonly serviceRestaurant: RestaurantService,

    private readonly serviceMichelineStar: MichelineStarService,
  ) {}

  async addMichelineStarToRestaurant(
    restaurantId: string,
    michelineStar: MichelineStarEntity,
  ): Promise<RestaurantEntity> {
    const restaurant: RestaurantEntity = await this.serviceRestaurant.findOneBy(
      restaurantId,
    );
    michelineStar.restaurant = restaurant;
    await this.serviceMichelineStar.create(michelineStar);
    return await this.serviceRestaurant.findOneBy(restaurantId, [
      'michelineStars',
    ]);
  }

  async findMichelineStarByRestaurantIdAndMichelineStarId(
    restaurantId: string,
    michelineStarId: string,
  ): Promise<MichelineStarEntity> {
    await this.serviceMichelineStar.findOneBy(michelineStarId);
    const restaurant: RestaurantEntity = await this.serviceRestaurant.findOneBy(
      restaurantId,
      ['michelineStars'],
    );

    const restaurantMichelineStar: MichelineStarEntity =
      await this.#findMichelineStarFromRestaurant(michelineStarId, restaurant);
    return restaurantMichelineStar;
  }

  async findMichelineStarsByRestaurantId(
    restaurantId: string,
  ): Promise<MichelineStarEntity[]> {
    const restaurant: RestaurantEntity = await this.serviceRestaurant.findOneBy(
      restaurantId,
      ['michelineStars'],
    );
    return restaurant.michelineStars;
  }

  async updateMichelineStarOfARestaurant(
    restaurantId: string,
    michelineStarId: string,
    michelineStar: MichelineStarEntity,
  ): Promise<RestaurantEntity> {
    const restaurant: RestaurantEntity = await this.serviceRestaurant.findOneBy(
      restaurantId,
      ['michelineStars'],
    );
    const persistedMichelineStar: MichelineStarEntity =
      await this.serviceMichelineStar.findOneBy(michelineStarId);
    await this.#findMichelineStarFromRestaurant(michelineStarId, restaurant);
    await this.michelineStarRepository.save({
      ...persistedMichelineStar,
      ...michelineStar,
    });
    return await this.serviceRestaurant.findOneBy(restaurantId, [
      'michelineStars',
    ]);
  }

  async deleteMichelineStarOfARestaurant(
    restaurantId: string,
    michelineStarId: string,
  ) {
    const restaurant: RestaurantEntity = await this.serviceRestaurant.findOneBy(
      restaurantId,
      ['michelineStars'],
    );
    await this.serviceMichelineStar.findOneBy(michelineStarId);
    const michelineStar = await this.#findMichelineStarFromRestaurant(
      michelineStarId,
      restaurant,
    );
    this.michelineStarRepository.delete(michelineStar);
  }

  async #findMichelineStarFromRestaurant(
    michelineStarId: string,
    restaurant: RestaurantEntity,
  ): Promise<MichelineStarEntity> {
    const restaurantMichelineStar: MichelineStarEntity =
      restaurant.michelineStars.find((ms) => ms.id === michelineStarId);
    if (!restaurantMichelineStar)
      throw new BusinessLogicException(
        'The Micheline Star with the given id is not associated to the Restaurant',
        BusinessError.PRECONDITION_FAILED,
      );
    return restaurantMichelineStar;
  }
}
