import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CultureEntity } from 'src/culture/culture.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { CultureRestaurantDto } from './culture-restaurant.dto';
import { CultureRestaurantService } from './culture-restaurant.service';

@Resolver()
export class CultureRestaurantResolver {
  constructor(private cultureRestaurantService: CultureRestaurantService) {}

  @Mutation(() => CultureEntity)
  addRestaurantToCulture(
    @Args('cultureId') cultureId: string,
    @Args('restaurantId') restaurantId: string,
  ): Promise<CultureEntity> {
    return this.cultureRestaurantService.addRestaurantToCulture(
      cultureId,
      restaurantId,
    );
  }

  @Query(() => RestaurantEntity, { nullable: true })
  findOneRestaurantByCulture(
    @Args('cultureId') cultureId: string,
    @Args('restaurantId') restaurantId: string,
  ): Promise<RestaurantEntity> {
    return this.cultureRestaurantService.findRestaurantByCultureIdAndRestaurantId(
      cultureId,
      restaurantId,
    );
  }

  @Query(() => [RestaurantEntity], { nullable: true })
  findAllRestaurantByCulture(
    @Args('cultureId') cultureId: string,
  ): Promise<RestaurantEntity[]> {
    return this.cultureRestaurantService.findRestaurantsByCultureId(cultureId);
  }

  @Mutation(() => CultureEntity)
  associateRestaurantsToCulture(
    @Args('cultureId') cultureId: string,
    @Args('restaurants', { type: () => [CultureRestaurantDto] })
    restaurantsDto: CultureRestaurantDto[],
  ) {
    const restaurants = plainToInstance(RestaurantEntity, restaurantsDto);
    return this.cultureRestaurantService.associateRestaurantsToCulture(
      cultureId,
      restaurants,
    );
  }

  @Mutation(() => String)
  deleteRestaurantOfACulture(
    @Args('cultureId') cultureId: string,
    @Args('restaurantId') restaurantId: string,
  ) {
    this.cultureRestaurantService.deleteRestaurantFromCulture(
      cultureId,
      restaurantId,
    );
    return restaurantId;
  }
}
