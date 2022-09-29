import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryEntity } from '../country/country.entity';
import { CountryService } from '../country/country.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

@Injectable()
export class CountryRestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private restaurantRepository: Repository<RestaurantEntity>,
    private countryService: CountryService,
    private restaurantService: RestaurantService,
  ) {}

  async addCountryToRestaurant(
    countryId: string,
    restaurantId: string,
  ): Promise<RestaurantEntity> {
    const restaurant: RestaurantEntity = await this.restaurantService.findOne(
      restaurantId,
    );
    const country: CountryEntity = await this.countryService.findOne(countryId);
    if (restaurant.country && restaurant.country.id === countryId) {
      throw new ConflictException('Country already has this restaurant');
    }
    restaurant.country = country;
    return await this.restaurantRepository.save(restaurant);
  }

  async deleteCountryFromRestaurant(
    countryId,
    restaurantId,
  ): Promise<RestaurantEntity> {
    const restaurant: RestaurantEntity = await this.restaurantService.findOne(
      restaurantId,
    );
    if (restaurant.country.id !== countryId) {
      throw new ConflictException(
        'Restaurant is not associated with the country',
      );
    } else {
      restaurant.country = null;
    }
    return await this.restaurantRepository.save(restaurant);
  }

  async findCountryByRestaurantId(
    restaurantId: string,
  ): Promise<CountryEntity> {
    const restaurant: RestaurantEntity = await this.restaurantService.findOneBy(
      restaurantId,
      ['country'],
    );
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return restaurant.country;
  }
}
