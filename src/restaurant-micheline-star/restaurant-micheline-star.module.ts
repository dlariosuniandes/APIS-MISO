import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MichelineStarEntity } from 'src/micheline-star/micheline-star.entity';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { RestaurantMichelineStarService } from './restaurant-micheline-star.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity, MichelineStarEntity])],
  providers: [RestaurantMichelineStarService],
})
export class RestaurantMichelineStarModule {}
