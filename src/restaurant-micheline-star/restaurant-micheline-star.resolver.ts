import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { MichelineStarDto } from 'src/micheline-star/micheline-star.dto';
import { MichelineStarEntity } from 'src/micheline-star/micheline-star.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { RestaurantMichelineStarService } from './restaurant-micheline-star.service';

@Resolver()
export class RestaurantMichelineStarResolver {
  constructor(
    private restaurantMichelineStarService: RestaurantMichelineStarService,
  ) {}

  @Query(() => MichelineStarEntity)
  michelineStar(
    @Args('restaurantId') restaurantId: string,
    @Args('michelineStarId') michelineStarId: string,
  ): Promise<MichelineStarEntity> {
    return this.restaurantMichelineStarService.findMichelineStarByRestaurantIdAndMichelineStarId(
      restaurantId,
      michelineStarId,
    );
  }

  @Query(() => [MichelineStarEntity])
  michelineStars(
    @Args('restaurantId') restaurantId: string,
  ): Promise<MichelineStarEntity[]> {
    return this.restaurantMichelineStarService.findMichelineStarsByRestaurantId(
      restaurantId,
    );
  }

  @Mutation(() => RestaurantEntity)
  createMichelineStar(
    @Args('restaurantId') restaurantId: string,
    @Args('michelineStar') michelineStarDto: MichelineStarDto,
  ): Promise<RestaurantEntity> {
    const michelineStar = plainToInstance(
      MichelineStarEntity,
      michelineStarDto,
    );
    return this.restaurantMichelineStarService.addMichelineStarToRestaurant(
      restaurantId,
      michelineStar,
    );
  }

  @Mutation(() => RestaurantEntity)
  updateMichelineStar(
    @Args('restaurantId') restaurantId: string,
    @Args('michelineStarId') michelineStarId: string,
    @Args('michelineStar') michelineStarDto: MichelineStarDto,
  ): Promise<RestaurantEntity> {
    const michelineStar = plainToInstance(
      MichelineStarEntity,
      michelineStarDto,
    );
    return this.restaurantMichelineStarService.updateMichelineStarOfARestaurant(
      restaurantId,
      michelineStarId,
      michelineStar,
    );
  }

  @Mutation(() => String)
  deleteMichelineStar(
    @Args('restaurantId') restaurantId: string,
    @Args('michelineStarId') michelineStarId: string,
  ) {
    this.restaurantMichelineStarService.deleteMichelineStarOfARestaurant(
      restaurantId,
      michelineStarId,
    );
    return michelineStarId;
  }
}
