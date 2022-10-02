import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MichelineStarEntity } from '../micheline-star/micheline-star.entity';
import { MichelineStarModule } from '../micheline-star/micheline-star.module';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { RestaurantMichelineStarService } from './restaurant-micheline-star.service';
import { RestaurantMichelineStarController } from './restaurant-micheline-star.controller';
import { RestaurantMichelineStarResolver } from './restaurant-micheline-star.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity, MichelineStarEntity]),
    RestaurantModule,
    MichelineStarModule,
  ],
  providers: [RestaurantMichelineStarService, RestaurantMichelineStarResolver],
  controllers: [RestaurantMichelineStarController],
})
export class RestaurantMichelineStarModule {}
