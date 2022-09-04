import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MichelineStarEntity } from 'src/micheline-star/micheline-star.entity';
import { MichelineStarService } from 'src/micheline-star/micheline-star.service';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { RestaurantMichelineStarService } from './restaurant-micheline-star.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity, MichelineStarEntity])],
  providers: [
    RestaurantMichelineStarService,
    RestaurantService,
    MichelineStarService,
  ],
})
export class RestaurantMichelineStarModule {}
