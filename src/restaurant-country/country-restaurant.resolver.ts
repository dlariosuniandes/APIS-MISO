import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CountryEntity } from 'src/country/country.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { CountryRestaurantService } from './country-restaurant.service';

@Resolver()
export class CountryRestaurantResolver {
  constructor(private countryRestaurantService: CountryRestaurantService) {}

  @Mutation(() => RestaurantEntity)
  addCountryToRestaurant(
    @Args('countryId') countryId: string,
    @Args('restaurantId') restaurantId: string,
  ): Promise<RestaurantEntity> {
    return this.countryRestaurantService.addCountryToRestaurant(
      countryId,
      restaurantId,
    );
  }

  @Query(() => CountryEntity, { nullable: true })
  getCountryByRestaurant(
    @Args('restaurantId') restaurantId: string,
  ): Promise<CountryEntity> {
    return this.countryRestaurantService.findCountryByRestaurantId(
      restaurantId,
    );
  }

  @Mutation(() => RestaurantEntity)
  deleteCountryOfARestaurant(
    @Args('countryId') countryId: string,
    @Args('restaurantId') restaurantId: string,
  ): Promise<RestaurantEntity> {
    return this.countryRestaurantService.deleteCountryFromRestaurant(
      countryId,
      restaurantId,
    );
  }
}
