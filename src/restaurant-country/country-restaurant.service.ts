import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryEntity } from 'src/country/country.entity';
import { CountryService } from 'src/country/country.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';

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
}
