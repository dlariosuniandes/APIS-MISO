import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MichelineStarEntity } from '../micheline-star/micheline-star.entity';
import { MichelineStarModule } from '../micheline-star/micheline-star.module';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { RestaurantMichelineStarService } from './restaurant-micheline-star.service';
import { RestaurantMichelineStarController } from './restaurant-micheline-star.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity, MichelineStarEntity]),
    RestaurantModule,
    MichelineStarModule,
  ],
  providers: [RestaurantMichelineStarService],
  controllers: [RestaurantMichelineStarController],
})
export class RestaurantMichelineStarModule {}
